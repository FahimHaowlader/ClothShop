import Employee from '../models/Employee.modal.js';


import { cookieOptions, refreshCookieOptions } from '../utils/const.js';






/**
 * @desc    Employee Login
 * @route   POST /api/employees/login
 * @access  Public
 */
export const loginEmployee = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    // 1. Find employee and check access permission
    const employee = await Employee.findOne({ email });
    if (!employee) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    if (!employee.access) {
      return res.status(403).json({ success: false, message: 'Access denied. Account is disabled.' });
    }

    // 2. Verify password
    const isPasswordValid = await employee.isPasswordCorrect(password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    // 3. Generate tokens
    const accessToken = employee.generateAccessToken();
    const refreshToken = employee.generateRefreshToken();

    // 4. Save refresh token
    employee.refreshToken = refreshToken;
    await employee.save({ validateBeforeSave: false });

    return res
      .status(200)
      .cookie('employeeAccessToken', accessToken, cookieOptions)
      .cookie('employeeRefreshToken', refreshToken, refreshCookieOptions)
      .json({
        success: true,
        message: 'Employee logged in successfully',
        employee: {
          _id: employee._id,
          employeeId: employee.employeeId,
          name: employee.name,
          email: employee.email,
          role: employee.role,
          pic: employee.pic,
          access: employee.access,
        },
      });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Create new employee profile
 * @route   POST /api/employees/create
 * @access  Private (Admin / Major)
 */
export const createEmployee = async (req, res) => {
  try {
    const { name, email, phone, password, pic, joinAt, employeeId, role, address } = req.body;

    // Validate required fields explicitly based on updated schema
    if (!name || !phone || !password || !pic || !joinAt) {
      return res.status(400).json({
        success: false,
        message: 'Name, phone, password, pic, and joinAt date are strictly required.',
      });
    }

    // Check for existing duplicates
    const existingEmployee = await Employee.findOne({
      $or: [
        { phone },
        ...(email ? [{ email }] : []),
        ...(employeeId ? [{ employeeId }] : []),
      ],
    });

    if (existingEmployee) {
      return res.status(400).json({
        success: false,
        message: 'An employee with this phone, email, or employeeId already exists.',
      });
    }

    // Create employee document
    const employee = await Employee.create({
      name,
      email,
      phone,
      password,
      pic,
      joinAt,
      employeeId,
      role: role || 'officer',
      address,
      access: true,
    });

    return res.status(201).json({
      success: true,
      message: 'Employee created successfully',
      employee: {
        _id: employee._id,
        employeeId: employee.employeeId,
        name: employee.name,
        role: employee.role,
        pic: employee.pic,
        joinAt: employee.joinAt,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get all employees
 * @route   GET /api/employees
 * @access  Private (Admin / Major / Officer)
 */
export const getAllEmployees = async (req, res) => {
  try {
    const { role, access } = req.query;
    const filter = {};

    if (role) filter.role = role;
    if (access !== undefined) filter.access = access === 'true';

    const employees = await Employee.find(filter)
      .select('-password -refreshToken')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: employees.length,
      employees,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get single employee details
 * @route   GET /api/employees/:id
 * @access  Private
 */
export const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id).select('-password -refreshToken');

    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found.' });
    }

    return res.status(200).json({ success: true, employee });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Update employee profile, role, or access permission
 * @route   PUT /api/employees/:id
 * @access  Private (Admin / Major)
 */
export const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, email, role, access, leaveAt, address, pic } = req.body;

    const employee = await Employee.findById(id);
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found.' });
    }

    if (name) employee.name = name;
    if (phone) employee.phone = phone;
    if (email) employee.email = email;
    if (role) employee.role = role;
    if (access !== undefined) employee.access = access;
    if (leaveAt) employee.leaveAt = leaveAt;
    if (address) employee.address = address;
    if (pic) employee.pic = pic;

    await employee.save();

    return res.status(200).json({
      success: true,
      message: 'Employee updated successfully',
      employee,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Employee Logout
 * @route   POST /api/employees/logout
 * @access  Private
 */
export const logoutEmployee = async (req, res) => {
  try {
    if (req.employee?._id) {
      await Employee.findByIdAndUpdate(
        req.employee._id,
        { $set: { refreshToken: '' } },
        { new: true }
      );
    }

    return res
      .status(200)
      .clearCookie('employeeAccessToken', cookieOptions)
      .clearCookie('employeeRefreshToken', refreshCookieOptions)
      .json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};