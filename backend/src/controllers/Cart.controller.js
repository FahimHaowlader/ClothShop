import Cart from "../models/Cart.modal.js";
import Product from "../models/Product.modal.js";
import User from "../models/User.modal.js";



// 🔹 Add item to cart
export const addItemToCart = async (req, res) => {
  try {
    const { productId, color, size, quantity, preOrder } = req.body;
    const userId = req.user._id;

    // Validate product existence
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Validate size availability
    const variant = product.variants.find((v) => v.color === color);
    if (!variant) {
      return res.status(400).json({ message: "Color not available" });
    }

    const availability = variant.availability.find((a) => a.size === size);
    if (!availability || !availability.available) {
      return res.status(400).json({ message: "Size not available" });
    }

    // Check if the user already has a cart
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      // Create a new cart for the user if it doesn't exist
      cart = new Cart({ user: userId, items: [] });
    }

    // Check if the item already exists in the cart
    const existingItemIndex = cart.items.findIndex(
      (item) =>
        item.productId.toString() === productId &&
        item.color === color &&
        item.size === size
    );

    if (existingItemIndex > -1) {
      // If the item exists, update the quantity
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // If the item doesn't exist, add it to the cart
      cart.items.push({
        productId,
        pic: variant.pic[0], // Assuming you want to use the first picture of the variant
        color,
        size,
        quantity,
        unitPrice: product.price,
        preOrder: preOrder || false,
      });
    }

    // Save the cart
    await cart.save();

    return res.status(200).json({ message: "Item added to cart", cart });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};


// 🔹 Get user's cart
export const getUserCart = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find the user's cart and populate product details
    const cart = await Cart.findOne({ user: userId }).populate({
        path: "items.productId",
        select: "name price pic variants", // Select only the fields you need
      });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    return res.status(200).json({ cart });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};


// 🔹 Remove item from cart
export const removeItemFromCart = async (req, res) => {
  try {
    const { productId, color, size } = req.body;
    const userId = req.user._id;

    // Find the user's cart
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Filter out the item to be removed
    cart.items = cart.items.filter(
      (item) =>
        !(
          item.productId.toString() === productId &&
          item.color === color &&
          item.size === size
        )
    );

    // Save the updated cart
    await cart.save();

    return res.status(200).json({ message: "Item removed from cart", cart });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
}; 

// 🔹 Clear user's cart
export const clearUserCart = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find the user's cart
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Clear the items in the cart
    cart.items = [];

    // Save the updated cart
    await cart.save();

    return res.status(200).json({ message: "Cart cleared", cart });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// update item quantity in cart
export const updateItemQuantityInCart = async (req, res) => {
  try {
    const { productId, color, size, quantity } = req.body;
    const userId = req.user._id;

    // Find the user's cart
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Find the item in the cart
    const itemIndex = cart.items.findIndex(
      (item) =>
        item.productId.toString() === productId &&
        item.color === color &&
        item.size === size
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    // Update the quantity of the item
    cart.items[itemIndex].quantity = quantity;

    // Save the updated cart
    await cart.save();

    return res.status(200).json({ message: "Item quantity updated", cart });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};