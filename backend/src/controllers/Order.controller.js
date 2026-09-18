import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Coupon from '../models/Coupon.js';

// Helper function to generate a unique short Order ID (e.g., ORD-829401)
const generateOrderId = () => {
  return `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
};

/**
 * @desc    Create a new order
 * @route   POST /api/orders
 * @access  Private (Customer) or Public (Guest)
 */
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
 * @desc    Get all orders with filter & status options
 * @route   GET /api/orders
 * @access  Private (Admin / Major / Officer)
 */
export const getAllOrders = async (req, res) => {
  try {
    const { orderStatus, paymentStatus, preOrder, page = 1, limit = 20 } = req.query;
    const filter = {};

    if (orderStatus) filter.orderStatus = orderStatus;
    if (paymentStatus) filter.paymentStatus = paymentStatus;
    if (preOrder !== undefined) filter.preOrder = preOrder === 'true';

    const skip = (Number(page) - 1) * Number(limit);

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate('user', 'name phone')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Order.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      count: orders.length,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      orders,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Update order workflow status (shipped, delivered, cancelled)
 * @route   PATCH /api/orders/:id/status
 * @access  Private (Admin / Major / Officer)
 */
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus, shippedAt, deliveredAt, cancelledAt } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    if (orderStatus) {
      order.orderStatus = orderStatus;
      order.processedBy = req.employee._id; // Tracks staff handling the order
    }

    if (shippedAt) order.shippedAt = shippedAt;
    if (deliveredAt) order.deliveredAt = deliveredAt;
    if (cancelledAt) order.cancelledAt = cancelledAt;

    await order.save();

    return res.status(200).json({
      success: true,
      message: `Order status updated to ${order.orderStatus}`,
      order,
    });
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