import Order from '../models/Order.modal.js';
import Product from '../models/Product.modal.js';
import Coupon from '../models/Coupon.modal.js';


import asyncHandler from '../utils/asyncHandler.js';
import apiError from '../utils/apiError.js';
import apiResponse from '../utils/apiResponse.js';

// user controllers

/**
  @desc Calculate the total price of an order
  @route POST /api/orders/calculate-total
  @access public (no authentication required)
 */

const calculateOrderTotal = async (req, res) => {
  try {
    const { orderItems, couponCode } = req.body;

    if (
      !Array.isArray(orderItems) ||
      orderItems.length === 0
    ) {
      throw new apiError(400, "No items in order.");
    }

    let totalPriceBeforeDiscount = 0;
    let totalPriceAfterDiscount = 0;

    let couponDiscountAmount = 0;
    let eligibleTotal = 0;
    let appliedCoupon = null;

    const validItems = [];
    const removedItems = [];

    const now = new Date();

    // 1. Validate coupon if provided
    let coupon = null;

    if (couponCode) {
      coupon = await Coupon.findOne({
        code: couponCode.toUpperCase().trim()
      });

      if (!coupon) {
        throw new apiError(404, "Invalid coupon code");
      }

      if (coupon.validFrom && now < coupon.validFrom) {
        throw new apiError(400, "Coupon is not active yet");
      }

      if (coupon.validUntil && now > coupon.validUntil) {
        throw new apiError(400, "Coupon has expired");
      }
    }

    // 2. Validate products, variants and inventory
    for (const item of orderItems) {
      const product = await Product.findById(item.productId).select(
        "-name -pic -sizeGuide -description -specifications -instructions -gender -category -collectionName -bestSeller -featured -createdAt -updatedAt"
      );

      if (!product) {
        removedItems.push(item.itemId);
        continue;
      }

      const variant = product.variants.find(
        v => v.color === item.color
      );

      if (!variant) {
        removedItems.push(item.itemId);
        continue;
      }

      const sizeInfo = variant.availability.find(
        s =>
          s._id.toString() === item.itemId.toString() &&
          s.size === item.size
      );

      if (!sizeInfo || !sizeInfo.available) {
        removedItems.push(item.itemId);
        continue;
      }

      const availableQuantity = sizeInfo.quantity;

      if (
        !Number.isInteger(item.quantity) ||
        item.quantity < 1 ||
        !Number.isInteger(availableQuantity) ||
        availableQuantity <= 0
      ) {
        removedItems.push(item.itemId);
        continue;
      }

      const finalQuantity = Math.min(
        item.quantity,
        availableQuantity
      );

      // 3. Calculate product discount
      const originalPrice = Math.ceil(product.price);

      let productDiscountAmount = 0;

      const discount = product.discount;

      if (
        discount?.amount > 0 &&
        discount.validFrom &&
        now >= discount.validFrom &&
        (!discount.validUntil || now <= discount.validUntil)
      ) {
        if (discount.type === "percentage") {
          productDiscountAmount = Math.ceil(
            originalPrice * discount.amount / 100
          );
        } else if (discount.type === "flat") {
          productDiscountAmount = Math.ceil(
            discount.amount
          );
        }
      }

      productDiscountAmount = Math.min(
        productDiscountAmount,
        originalPrice
      );

      const discountedPrice =
        originalPrice - productDiscountAmount;

      const itemTotalBeforeDiscount =
        originalPrice * finalQuantity;

      const itemTotalAfterDiscount =
        discountedPrice * finalQuantity;

      totalPriceBeforeDiscount += itemTotalBeforeDiscount;
      totalPriceAfterDiscount += itemTotalAfterDiscount;

      // 4. Calculate coupon eligible total
      if (
        coupon &&
        (
          coupon.discountApplyTo.type === "general" ||
          coupon.discountApplyTo.products.some(
            id => id.toString() === product._id.toString()
          )
        )
      ) {
        eligibleTotal += itemTotalAfterDiscount;
      }

      validItems.push({
        ...item,
        quantity: finalQuantity
      });
    }

    // 5. Check valid items
    if (validItems.length === 0) {
      throw new apiError(
        400,
        "No valid items available in your order."
      );
    }

    // 6. Apply coupon if provided
    if (coupon) {
      if (
        coupon.discountApplyTo.type === "individual" &&
        eligibleTotal === 0
      ) {
        throw new apiError(
          400,
          "Coupon does not apply to selected products"
        );
      }

      if (eligibleTotal < coupon.minPurchaseAmount) {
        throw new apiError(
          400,
          `Minimum purchase amount is ${coupon.minPurchaseAmount} for eligible products`
        );
      }

      if (coupon.discountType === "percentage") {
        couponDiscountAmount = Math.ceil(
          eligibleTotal * coupon.discountValue / 100
        );

        if (coupon.maxDiscountAmount != null) {
          couponDiscountAmount = Math.min(
            couponDiscountAmount,
            Math.floor(coupon.maxDiscountAmount)
          );
        }
      } else {
        couponDiscountAmount = Math.ceil(
          coupon.discountValue
        );
      }

      couponDiscountAmount = Math.min(
        couponDiscountAmount,
        eligibleTotal
      );

      appliedCoupon = coupon.code;
    }

    // 7. Calculate final total
    const totalPriceAfterCoupon = Math.max(
      0,
      totalPriceAfterDiscount - couponDiscountAmount
    );

    // 8. Send response
    return res.status(200).json(
      new apiResponse(
        200,
        {
          validItems,
          removedItems,
          totalPriceBeforeDiscount,
          totalPriceAfterDiscount,
          eligibleTotal,
          couponDiscountAmount,
          totalPriceAfterCoupon,
          appliedCoupon
        },
        "Order total calculated successfully"
      )
    );

  } catch (error) {
    if (error instanceof apiError) {
      throw error;
    }
    throw new apiError(500, error.message);
  }
};



/**
 @desc   Initialize an order with delivery charges and coupon application
 @route  POST /api/orders/initialize-order
 @access public (no authentication required)
 */

const DELIVERY_CHARGES = {
  inside_dhaka: 70,
  outside_dhaka: 130
};

export const initializeOrder = asyncHandler(async (req, res) => {
  try{
  const {
    orderItems,
    couponCode,
    deliveryZone
  } = req.body;

  // 1. Validate order items
  if (!Array.isArray(orderItems) || orderItems.length === 0) {
    throw new apiError(400, "No items in order.");
  }

  // 2. Validate delivery zone
  if (!Object.hasOwn(DELIVERY_CHARGES, deliveryZone)) {
    throw new apiError(400, "Invalid delivery zone.");
  }

  const deliveryCharge = DELIVERY_CHARGES[deliveryZone];

  const now = new Date();

  let totalPriceBeforeDiscount = 0;
  let totalPriceAfterDiscount = 0;

  let couponDiscountAmount = 0;
  let eligibleTotal = 0;
  let appliedCoupon = null;

  const validItems = [];
  const removedItems = [];

  // 3. Validate coupon
  let coupon = null;

  if (couponCode?.trim()) {
    coupon = await Coupon.findOne({
      code: couponCode.trim().toUpperCase()
    });

    if (!coupon) {
      throw new apiError(404, "Invalid coupon code.");
    }

    if (coupon.validFrom && now < coupon.validFrom) {
      throw new apiError(400, "Coupon is not active yet.");
    }

    if (coupon.validUntil && now > coupon.validUntil) {
      throw new apiError(400, "Coupon has expired.");
    }
  }

  // 4. Validate products, variants and inventory
  for (const item of orderItems) {
    const product = await Product.findById(item.productId).select(
      "-sizeGuide -description -specifications -instructions -gender -category -collectionName -bestSeller -featured -createdAt -updatedAt"
    );

    if (!product) {
      removedItems.push(item.itemId);
      continue;
    }

    const variant = product.variants.find(
      v => v.color === item.color
    );

    if (!variant) {
      removedItems.push(item.itemId);
      continue;
    }

    const sizeInfo = variant.availability.find(
      s =>
        s._id.toString() === item.itemId.toString() &&
        s.size === item.size
    );

    if (!sizeInfo || !sizeInfo.available) {
      removedItems.push(item.itemId);
      continue;
    }

    const availableQuantity = sizeInfo.quantity;

    if (
      !Number.isInteger(item.quantity) ||
      item.quantity < 1 ||
      !Number.isInteger(availableQuantity) ||
      availableQuantity <= 0
    ) {
      removedItems.push(item.itemId);
      continue;
    }

    // 5. Validate requested quantity
    if (item.quantity > availableQuantity) {
      throw new apiError(
        400,
        `Only ${availableQuantity} items are available in stock.`
      );
    }

    const finalQuantity = item.quantity;

    // 6. Calculate product discount
    const originalPrice = Math.ceil(product.price);

    let productDiscountAmount = 0;

    const discount = product.discount;

    if (
      discount?.amount > 0 &&
      discount.validFrom &&
      now >= discount.validFrom &&
      (!discount.validUntil || now <= discount.validUntil)
    ) {
      if (discount.type === "percentage") {
        productDiscountAmount = Math.ceil(
          originalPrice * discount.amount / 100
        );
      } else if (discount.type === "flat") {
        productDiscountAmount = Math.ceil(
          discount.amount
        );
      }
    }

    productDiscountAmount = Math.min(
      productDiscountAmount,
      originalPrice
    );

    const discountedPrice =
      originalPrice - productDiscountAmount;

    const itemTotalBeforeDiscount =
      originalPrice * finalQuantity;

    const itemTotalAfterDiscount =
      discountedPrice * finalQuantity;

    totalPriceBeforeDiscount += itemTotalBeforeDiscount;
    totalPriceAfterDiscount += itemTotalAfterDiscount;

    // 7. Calculate coupon eligible total
    if (
      coupon &&
      (
        coupon.discountApplyTo.type === "general" ||
        coupon.discountApplyTo.products.some(
          id => id.toString() === product._id.toString()
        )
      )
    ) {
      eligibleTotal += itemTotalAfterDiscount;
    }

    // 8. Prepare valid order items
    validItems.push({
      ...item,
      name: product.name,
      productCode: product.productCode,
      unitePrice: product.price,
      subTotal: (product.price * finalQuantity),
      discount: {
        type: product.discount?.type || null, 
        amount: product.discount?.amount || 0 
      },
      quantity: finalQuantity,
      preOrder: product.canPreOrder && product.preOrderValid && product.preOrderValid >= now
    });
  }

  // 9. Check valid items
  if (validItems.length === 0) {
    throw new apiError(
      400,
      "No valid items available in your order."
    );
  }

  // 10. Apply coupon
  if (coupon) {
  if (
    (
      coupon.discountApplyTo.type === "individual" &&
      eligibleTotal === 0
    ) ||
    eligibleTotal < coupon.minPurchaseAmount
  ) {
    couponDiscountAmount = 0;
  } else {
    if (coupon.discountType === "percentage") {
      couponDiscountAmount = Math.ceil(
        eligibleTotal * coupon.discountValue / 100
      );

      if (coupon.maxDiscountAmount != null) {
        couponDiscountAmount = Math.min(
          couponDiscountAmount,
          Math.floor(coupon.maxDiscountAmount)
        );
      }
    } else {
      couponDiscountAmount = Math.ceil(
        coupon.discountValue
      );
    }

    couponDiscountAmount = Math.min(
      couponDiscountAmount,
      eligibleTotal
    );

    appliedCoupon = coupon.code;
  }
}
  // 11. Calculate subtotal after discounts
  const totalPriceAfterCoupon = Math.max(
    0,
    totalPriceAfterDiscount - couponDiscountAmount
  );

  // 12. Add delivery charge
  const totalPriceWithDeliveryCharge = totalPriceAfterCoupon + deliveryCharge;

  // 13. Send response
  return res.status(200).json(
    new apiResponse(
      200,
      {
        validItems,
        removedItems,

        totalPriceBeforeDiscount,
        totalPriceAfterDiscount,

        eligibleTotal,
        couponDiscountAmount,

        totalPriceAfterCoupon,

        deliveryZone,
        deliveryCharge,

        totalPriceWithDeliveryCharge,
        appliedCoupon
      },
      "Order initialized successfully."
    )
  )
} catch (error) {
    if (error instanceof apiError) {
      throw error;
    }
    throw new apiError(500, error.message);
  }
})
;



 const createOrder = async (req, res) => {
  try {
    const {
      user,
      name,
      phone,
      shippingAddress,
      orderItems,
      couponCode,
      totalPriceBeforeDiscount,
      totalPriceAfterDiscount,
      totalPriceAfterCoupon,
      deliveryCharge,
      orderNote,
      orderFrom,
      orderStatus,
      paymentStatus,
      paymentMethod,
      transactionId,
      paidAt,
      totalPriceWithDeliveryCharge,
      storeAmount,
      
      
      
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ success: false, message: 'No items in order.' });
    }

    if (!shippingAddress || !phone || !name || !totalPriceBeforeDiscount || !totalPriceAfterDiscount || !totalPriceAfterCoupon || !deliveryCharge || !totalPriceWithDeliveryCharge || !paymentMethod || !paymentStatus|| !orderStatus || !orderFrom) {
      return res.status(400).json({
        success: false,
        message: 'Name, phone number, and shipping address are required.',
      });
    }
 if(paymentMethod === 'online' && ( paymentStatus !== 'paid' ||!transactionId || !paidAt ||!storeAmount )){
  throw new apiError(400, 'Transaction ID, paidAt date, and store amount are required for online paid orders.'); }

if(paymentMethod === 'cod' ){
  storeAmount = Number(storeAmount.toFixed(2) * .01) - deliveryCharge;
    
}

if(paymentMethod === 'online' ){
  storeAmount = Number(storeAmount.toFixed(2)) - deliveryCharge;
}

const orderObject = {
  user,
   name,
      phone,
      shippingAddress,
      orderItems,
      couponCode,
      totalPriceBeforeDiscount,
      totalPriceAfterDiscount,
      totalPriceAfterCoupon,
      deliveryCharge,
      orderNote,
      orderFrom,
      orderStatus,
      paymentStatus,
      paymentMethod,
      totalPriceWithDeliveryCharge,
      storeAmount,
}


if(paymentMethod === 'online'){
  orderObject.transactionId = transactionId;
  orderObject.paidAt = paidAt;
}
    // 3. Save Order
    const order = await Order.create({
      
     
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


export const cancelOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const currentUserId = req.employee._id;
  const userRole = req.employee.role;

  // 1. Start Mongoose Session
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 2. Fetch order within the transaction session
    const order = await Order.findOne({
      $or: [
        { _id: mongoose.Types.ObjectId.isValid(orderId) ? orderId : null },
        { orderId: orderId },
      ],
    }).session(session);

    if (!order) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    // 3. Authorization check
    const isAdminOrManager = ['admin', 'manager'].includes(userRole);
    const isAssignedEmployee = order.employeeId?.toString() === currentUserId.toString();

    if (!isAdminOrManager && !isAssignedEmployee) {
      await session.abortTransaction();
      session.endSession();
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this order.',
      });
    }

    // 4. Status check: Prevent modifying completed, delivered, or already cancelled orders
    if (['delivered', 'cancelled'].includes(order.orderStatus)) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: `Cannot change an order that is already '${order.orderStatus}'.`,
      });
    }

    // 5. Update order status and set timestamp & audit fields
    order.orderStatus = 'cancelled';
    order.cancelledAt = new Date();

    await order.save({ session });

    // 6. Restock Product Quantity in Nested Variants Array
    if (order.orderItems && order.orderItems.length > 0) {
      const bulkOps = order.orderItems.map((item) => ({
        updateOne: {
          filter: { _id: item.productId },
          $inc: {
            'variants.$[v].availability.$[a].quntity': item.quantity,
          },
          arrayFilters: [
            { 'v.color': item.color },
            { 'a.size': item.size },
          ],
        },
      }));

      // Pass session into bulkWrite
      await Product.bulkWrite(bulkOps, { session });
    }

    // 7. Commit transaction if all database writes succeed
    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      success: true,
      message: 'Order status updated to cancelled and product stock restocked successfully.',
      order,
    });
  } catch (error) {
    // Abort transaction on any runtime error
    await session.abortTransaction();
    session.endSession();
    throw error; // Re-throw error to be caught by asyncHandler
  }
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



