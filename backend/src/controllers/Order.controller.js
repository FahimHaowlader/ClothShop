import Order from '../models/Order.modal.js';
import Product from '../models/Product.modal.js';
import Coupon from '../models/Coupon.modal.js';


// user controllers

export const calculateOrderTotal = async (req, res) => {
  try {
    const { orderItems, couponCode } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ success: false, message: 'No items in order.' });
    }

    let calculatedSubTotal = 0;

    // 1. Process items and verify prices & stock
    for (const item of orderItems) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res
          .status(404)
          .json({ success: false, message: `Product not found: ${item.productId}` });
      }

      // Find selected color variant
      const variant = product.variants.find((v) => v.color === item.color);
      if (!variant) {
        return res
          .status(400)
          .json({ success: false, message: `Color '${item.color}' not available for ${product.name}` });
      }

      // Check stock size availability
      const sizeInfo = variant.availability.find((s) => s.size === item.size);
      if (!sizeInfo || !sizeInfo.available) {
        return res
          .status(400)
          .json({ success: false, message: `Size '${item.size}' is out of stock for ${product.name}` });
      }

      // Compute item discount if active on product
      let itemPrice = product.price;

      if (
        product.discount?.amount > 0 &&
        (!product.discount.valid || new Date(product.discount.valid) >= new Date())
      ) {
        if (product.discount.type === 'percentage') {
          itemPrice = product.price - (product.price * product.discount.amount) / 100;
        } else if (product.discount.type === 'flat') {
          itemPrice = Math.max(0, product.price - product.discount.amount);
        }
      }

      const itemSubTotal = itemPrice * item.quantity;
      calculatedSubTotal += itemSubTotal;
    } 
    console.log('Calculated Subtotal:', calculatedSubTotal);

    let finalTotal = calculatedSubTotal;

    // 2. Apply Coupon if supplied
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase().trim() });
      if (coupon && coupon.minPurchaseAmount <= calculatedSubTotal) {
        let couponDiscount = 0;
        if (coupon.discountType === 'percentage') {
          couponDiscount = (calculatedSubTotal * coupon.discountValue) / 100;
          if (coupon.maxDiscountAmount) {
            couponDiscount = Math.min(couponDiscount, coupon.maxDiscountAmount);
          }
        } else {
          couponDiscount = coupon.discountValue;
        }
        finalTotal = Math.max(0, calculatedSubTotal - couponDiscount);
      }
    }

    return res.status(200).json({
      success: true,
      calculatedSubTotal: Number(calculatedSubTotal.toFixed(2)),
      finalTotal: Number(finalTotal.toFixed(2)),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


export const createOrder = async (req, res) => {
  try {
    const {
      name,
      phone,
      shippingAddress,
      orderItems,
      couponCode,
      paymentMethod,
      preOrder = false,
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ success: false, message: 'No items in order.' });
    }

    if (!shippingAddress || !phone || !name) {
      return res.status(400).json({
        success: false,
        message: 'Name, phone number, and shipping address are required.',
      });
    }

    let calculatedSubTotal = 0;
    const processedItems = [];

    // 1. Process items and verify prices & stock
    for (const item of orderItems) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res
          .status(404)
          .json({ success: false, message: `Product not found: ${item.productId}` });
      }

      // Find selected color variant
      const variant = product.variants.find((v) => v.color === item.color);
      if (!variant) {
        return res
          .status(400)
          .json({ success: false, message: `Color '${item.color}' not available for ${product.name}` });
      }

      // Check stock size availability unless it's a pre-order
      const sizeInfo = variant.availability.find((s) => s.size === item.size);
      if (!preOrder && (!sizeInfo || !sizeInfo.available)) {
        return res
          .status(400)
          .json({ success: false, message: `Size '${item.size}' is out of stock for ${product.name}` });
      }

      // Compute item discount if active on product
      let discountObj = { type: undefined, amount: 0 };
      let itemPrice = product.price;

      if (
        product.discount?.amount > 0 &&
        (!product.discount.valid || new Date(product.discount.valid) >= new Date())
      ) {
        discountObj = {
          type: product.discount.type,
          amount: product.discount.amount,
        };
        if (product.discount.type === 'percentage') {
          itemPrice = product.price - (product.price * product.discount.amount) / 100;
        } else if (product.discount.type === 'flat') {
          itemPrice = Math.max(0, product.price - product.discount.amount);
        }
      }

      const itemSubTotal = itemPrice * item.quantity;
      calculatedSubTotal += itemSubTotal;

      processedItems.push({
        productId: product._id,
        pic: item.pic || (variant.pic && variant.pic[0]) || '',
        color: item.color,
        size: item.size,
        quantity: item.quantity,
        unitPrice: product.price,
        subTotal: Number(itemSubTotal.toFixed(2)),
        discount: discountObj,
      });
    }

    let finalTotal = calculatedSubTotal;

    // 2. Apply Coupon if supplied
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase().trim() });
      if (coupon && coupon.minPurchaseAmount <= calculatedSubTotal) {
        let couponDiscount = 0;
        if (coupon.discountType === 'percentage') {
          couponDiscount = (calculatedSubTotal * coupon.discountValue) / 100;
          if (coupon.maxDiscountAmount) {
            couponDiscount = Math.min(couponDiscount, coupon.maxDiscountAmount);
          }
        } else {
          couponDiscount = coupon.discountValue;
        }
        finalTotal = Math.max(0, calculatedSubTotal - couponDiscount);
        coupon.useCount += 1;
        await coupon.save();
      }
    }

    // 3. Save Order
    const order = await Order.create({
      orderId: generateOrderId(),
      user: req.user ? req.user._id : undefined,
      name,
      phone,
      shippingAddress,
      orderItems: processedItems,
      subTotalAfterDiscount: Number(finalTotal.toFixed(2)),
      preOrder,
      paymentMethod,
      orderStatus: 'pending',
      paymentStatus: 'unpaid',
    });

    return res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      order,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const payOnline = async (req, res) => {
  try {
    const { orderId, transactionId } = req.body;

    if (!orderId || !transactionId) {
      return res.status(400).json({ success: false, message: 'Order ID and transaction ID are required.' });
    }

    const order = await Order.findOne({ orderId });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    // Update payment status and transaction ID
    order.paymentStatus = 'paid';
    order.transactionId = transactionId;
    order.paidAt = new Date();

    await order.save();

    return res.status(200).json({
      success: true,
      message: 'Payment successful',
      order,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get logged in user orders
 * @route   GET /api/orders/my-orders
 * @access  Private (Customer)
 */
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('orderItems.productId', 'name productCode')
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, count: orders.length, orders });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get order details by orderId or ObjectId
 * @route   GET /api/orders/:id
 * @access  Private
 */
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findOne({
      $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { orderId: id }],
    })
      .populate('user', 'name email phone')
      .populate('processedBy', 'name employeeId role');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    return res.status(200).json({ success: true, order });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};




/**
 * @desc    Update payment status
 * @route   PATCH /api/orders/:id/payment
 * @access  Private (Admin / Major / Officer)
 */
export const updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentStatus, transactionId, paymentMethod } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    if (paymentStatus) {
      order.paymentStatus = paymentStatus;
      if (paymentStatus === 'paid') {
        order.paidAt = new Date();
      }
    }
    if (transactionId) order.transactionId = transactionId;
    if (paymentMethod) order.paymentMethod = paymentMethod;

    await order.save();

    return res.status(200).json({
      success: true,
      message: 'Payment information updated',
      order,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Request or process order refund
 * @route   PATCH /api/orders/:id/refund
 * @access  Private
 */
export const processRefund = async (req, res) => {
  try {
    const { id } = req.params;
    const { refundStatus, refundMethod, refundReason } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    if (refundStatus) order.refundStatus = refundStatus;
    if (refundMethod) order.refundMethod = refundMethod;
    if (refundReason) order.refundReason = refundReason;

    if (refundStatus === 'refunded') {
      order.refundDate = new Date();
    }

    await order.save();

    return res.status(200).json({
      success: true,
      message: 'Refund details updated successfully',
      order,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// officer controllers 

export const getUnassignedOrders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const filter = {
    orderStatus: { $in: ['pending', 'confirmed'] },
    employeeId: { $exists: false }, // Only fetches orders without an assigned employee
  };

  const [orders, total] = await Promise.all([
    Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Order.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    total,
    page: Number(page),
    totalPages: Math.ceil(total / Number(limit)),
    orders,
  });
});

export const getOrderDetailsById = asyncHandler(async (req, res) => {
  const { orderId } = req.params;

  const order = await Order.findById(orderId)
    .populate('user', 'name email phone')
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found.' });
  }

  res.status(200).json({
    success: true,
    order,
  });
});

export const getOrderByStatus = asyncHandler(async (req, res) => {
  const { status } = req.params;
  const { page = 1, limit = 20 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const filter = {
    orderStatus: status,
  };

  const [orders, total] = await Promise.all([
    Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Order.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    total,
    page: Number(page),
    totalPages: Math.ceil(total / Number(limit)),
    orders,
  });
});

export const getAssignedOrdersByEmployee = asyncHandler(async (req, res) => {
  const { employeeId } = req.params;
  const { page = 1, limit = 20 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const filter = {
    employeeId: employeeId,
    orderStatus: { $in: ['pending', 'confirmed'] },
  };

  const [orders, total] = await Promise.all([
    Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Order.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    total,
    page: Number(page),
    totalPages: Math.ceil(total / Number(limit)),
    orders,
  });
});

export const getOrdersByStatusAndEmployee = asyncHandler(async (req, res) => {
  const { status, employeeId } = req.params;
  const { page = 1, limit = 20 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const filter = {
    orderStatus: status,
    employeeId: employeeId,
  };

  const [orders, total] = await Promise.all([
    Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Order.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    total,
    page: Number(page),
    totalPages: Math.ceil(total / Number(limit)),
    orders,
  });
});

export const assignOrderToEmployee = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const currentUserId = req.employee._id;
  const userRole = req.employee.role; // Assumes role is stored on req.employee ('admin', 'manager', 'employee')

  // 1. Determine target employee ID based on role
  let targetEmployeeId;

  if (['admin', 'manager'].includes(userRole)) {
    // Admin/Manager can assign to the provided employeeId or fall back to assigning to themselves
    targetEmployeeId = req.body.employeeId || currentUserId;
  } else {
    // Normal employees can ONLY self-assign
    if (req.body.employeeId && req.body.employeeId.toString() !== currentUserId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Normal employees can only assign orders to themselves.',
      });
    }
    targetEmployeeId = currentUserId;
  }

  // 2. Atomic update: check if order exists AND hasn't been assigned yet (prevents race conditions)
  const updatedOrder = await Order.findOneAndUpdate(
    { _id: orderId, employeeId: { $exists: false } },
    { $set: { employeeId: targetEmployeeId } },
    { new: true, runValidators: true }
  );

  if (!updatedOrder) {
    // Check if the order exists at all or if it was already assigned
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }
    return res.status(400).json({
      success: false,
      message: 'Order is already assigned to an employee.',
    });
  }

  return res.status(200).json({
    success: true,
    message: 'Order assigned successfully.',
    order: updatedOrder,
  });
}); 

export const resignFromOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const currentUserId = req.employee._id;
  const userRole = req.employee.role;

  // 1. Fetch order
  const order = await Order.findById(orderId);

  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found.' });
  }

  // 2. Check if order is actually assigned to someone
  if (!order.employeeId) {
    return res.status(400).json({
      success: false,
      message: 'This order is not currently assigned to any employee.',
    });
  }

  // 3. Role-based check: Regular employees can only unassign themselves
  const isSelfAssignment = order.employeeId.toString() === currentUserId.toString();
  const isAdminOrManager = ['admin', 'manager'].includes(userRole);

  if (!isSelfAssignment && !isAdminOrManager) {
    return res.status(403).json({
      success: false,
      message: 'You can only resign from orders assigned to you.',
    });
  }

  // 4. Optional: Prevent resigning if order is already delivered, completed, or cancelled
  const LOCKED_STATUSES = ['delivered', 'completed', 'cancelled'];
  if (LOCKED_STATUSES.includes(order.orderStatus)) {
    return res.status(400).json({
      success: false,
      message: `Cannot resign from order with status '${order.orderStatus}'.`,
    });
  }

  // 5. Unassign employee using $unset
  const updatedOrder = await Order.findByIdAndUpdate(
    orderId,
    { $unset: { employeeId: "" } },
    { new: true }
  );

  return res.status(200).json({
    success: true,
    message: 'Resigned from order successfully.',
    order: updatedOrder,
  });
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { orderStatus, shippedAt, deliveredAt, cancelledAt } = req.body;
  const currentUserId = req.employee._id;
  const userRole = req.employee.role;

  // 1. Fetch order
  const order = await Order.findById(orderId);

  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found.' });
  }

  // 2. Authorization check: Managers and admins can update any order,
  // whereas regular employees can ONLY update orders assigned to them.
  const isAdminOrManager = ['admin', 'manager'].includes(userRole);
  const isAssignedEmployee = order.employeeId?.toString() === currentUserId.toString();

  if (!isAdminOrManager && !isAssignedEmployee) {
    return res.status(403).json({
      success: false,
      message: 'You are not authorized to update this order status.',
    });
  }

  // 3. Update status and timestamps
  if (orderStatus) order.orderStatus = orderStatus;

  // Automatically set timestamps based on status if not manually passed
  if (orderStatus === 'shipped' || shippedAt) {
    order.shippedAt = shippedAt || new Date();
  }
  if (orderStatus === 'delivered' || deliveredAt) {
    order.deliveredAt = deliveredAt || new Date();
  }
  if (orderStatus === 'cancelled' || cancelledAt) {
    order.cancelledAt = cancelledAt || new Date();
  }

  await order.save();

  return res.status(200).json({
    success: true,
    message: 'Order status updated successfully.',
    order,
  });
});

// manager and admin controllers

export const reassignOrderToEmployee = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const currentUserId = req.employee._id;
  const userRole = req.employee.role; // Assumes role is stored on req.employee ('admin', 'manager', 'employee')

  // Allowed statuses for assignment
  const ALLOWED_STATUSES = ['pending', 'confirm', 'packed'];

  // 1. Determine target employee ID based on role
  let targetEmployeeId;

  if (['admin', 'manager'].includes(userRole)) {
    // Admin/Manager can assign to the provided employeeId or fall back to self-assignment
    targetEmployeeId = req.body.employeeId || currentUserId;
  } else {
    // Normal employees can ONLY self-assign
    if (req.body.employeeId && req.body.employeeId.toString() !== currentUserId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Normal employees can only assign orders to themselves.',
      });
    }
    targetEmployeeId = currentUserId;
  }

  // 2. Atomic update: Order must not be assigned AND must have an allowed orderStatus
  const updatedOrder = await Order.findOneAndUpdate(
    { 
      _id: orderId, 
      employeeId: { $exists: false },
      orderStatus: { $in: ALLOWED_STATUSES }
    },
    { $set: { employeeId: targetEmployeeId } },
    { new: true, runValidators: true }
  );

  if (!updatedOrder) {
    // Determine the specific reason for failure
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }
    if (order.employeeId) {
      return res.status(400).json({ success: false, message: 'Order is already assigned to an employee.' });
    }
    if (!ALLOWED_STATUSES.includes(order.orderStatus)) {
      return res.status(400).json({ 
        success: false, 
        message: `Order cannot be assigned because its status is '${order.orderStatus}'. Status must be 'pending', 'confirm', or 'packed'.` 
      });
    }
  }

  return res.status(200).json({
    success: true,
    message: 'Order assigned successfully.',
    order: updatedOrder,
  });
});



