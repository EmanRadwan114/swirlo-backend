import Cart from "../../db/models/cart.model.js";

const addProductToCart = async (req, res, userID) => {
  try {
    //authorize user
    if (!userID)
      return res
        .status(401)
        .json({ message: "you are not authorized to get this content" });
    //get cart of user
    let cart = await Cart.findOne({ userID });
    let { productId } = req.body;

    //if there is no cart for user so create one
    if (!cart) {
      let cartUser = await Cart.create({
        userID: userID,
        cartItems: [{ productId, quantity: 1 }],
      });
      return res.status(200).json({
        message: "product added to cart successfully",
        data: cartUser.cartItems,
      });
    }

    //the product exists in cart items or not
    const existingItem = cart.cartItems.find(
      (item) => item.productId.toString() === productId
    );
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.cartItems.push({ productId, quantity: 1 }); // add new product
    }
    await cart.save();
    const totalItems = cart.cartItems.reduce(
      (acc, item) => acc + item.quantity,
      0
    );
    const subtotal = cart.cartItems.reduce((acc, item) => {
      const product = item.productId;
      if (!product) return acc;
      return acc + product.price * item.quantity;
    }, 0);
    res.status(200).json({
      message: "product added to cart successfully",
      data: cart.cartItems,
      totalItems,
      subtotal,
    });
  } catch (err) {
    res.status(500).json({ message: "server error" });
  }
};

const getUserCart = async (req, res, userID) => {
  try {
    if (!userID)
      return res
        .status(401)
        .json({ message: "you are not authorized to get this content" });
    const page = parseInt(req.query.page) || 1; // default page 1
    const limit = parseInt(req.query.limit) || 3;
    const skip = (page - 1) * limit;
    //get cart with product data
    let cart = await Cart.findOne({ userID }).populate({
      path: "cartItems.productId",
      select: "title thumbnail price ingredients stock",
    });

    if (!cart) return res.status(404).json({ message: "no cart for user" });

    //if product is out of stock will be removed
    const validCartItems = cart.cartItems.filter((item) => {
      const product = item.productId; //productId holds the product object
      return product && product.stock > 0;
    });
    //to maintain any change
    if (validCartItems.length !== cart.cartItems.length) {
      cart.cartItems = validCartItems;
      await cart.save();
    }
    const totalItems = validCartItems.reduce(
      (acc, item) => acc + item.quantity,
      0
    );
    const subtotal = validCartItems.reduce((acc, item) => {
      const product = item.productId;
      if (!product) return acc;
      return acc + product.price * item.quantity;
    }, 0);
    const paginatedItems = validCartItems.slice(skip, skip + limit);
    const totalPages = Math.ceil(validCartItems.length / limit);
    res.status(200).json({
      message: "cart items returned successfully",
      currentPage: page,
      totalPages,
      data: paginatedItems,
      totalItems,
      subtotal,
    });
  } catch (err) {
    res.status(500).json({ message: "server error" });
  }
};
const getCartForCheckout = async (req, res, userID) => {
  try {
    if (!userID)
      return res
        .status(401)
        .json({ message: "you are not authorized to get this content" });
    let cart = await Cart.findOne({ userID }).populate({
      path: "cartItems.productId",
      select: "title thumbnail price ingredients stock",
    });

    if (!cart) return res.status(404).json({ message: "no cart for user" });

    //if product is out of stock will be removed
    const validCartItems = cart.cartItems.filter((item) => {
      const product = item.productId; //productId holds the product object
      return product && product.stock > 0;
    });
    //to maintain any change
    if (validCartItems.length !== cart.cartItems.length) {
      cart.cartItems = validCartItems;
      await cart.save();
    }
    res.status(200).json({
      message: "cart items returned successfully",
      data: cart.cartItems,
    });
  } catch (err) {
    res.status(500).json({ message: "server error" });
  }
};

const updateCartItem = async (req, res, userID) => {
  try {
    if (!userID)
      return res
        .status(401)
        .json({ message: "you are not authorized to get this content" });
    //get cart of user
    let cart = await Cart.findOne({ userID }).populate({
      path: "cartItems.productId",
      select: "title thumbnail price ingredients stock",
    });
    if (!cart) return res.status(404).json({ message: "no cart for user" });

    let { productId } = req.params;
    let quantity = req.body.quantity;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: "quantity must be at least 1" });
    }

    const existingItem = cart.cartItems.find(
      (item) => item.productId._id.toString() === productId
    );

    if (!existingItem) {
      return res.status(404).json({ message: "product not found in cart" });
    }
    existingItem.quantity = quantity;
    await cart.save();
    const totalItems = cart.cartItems.reduce(
      (acc, item) => acc + item.quantity,
      0
    );
    const subtotal = cart.cartItems.reduce((acc, item) => {
      const product = item.productId;
      if (!product) return acc;
      return acc + product.price * item.quantity;
    }, 0);
    res.status(200).json({
      message: "product in cart items updated successfully",
      data: cart.cartItems,
      totalItems,
      subtotal,
    });
  } catch (err) {
    res.status(500).json({ message: "server error" });
  }
};

const deleteCartItem = async (req, res, userID) => {
  try {
    if (!userID)
      return res
        .status(401)
        .json({ message: "you are not authorized to get this content" });

    let cart = await Cart.findOne({ userID }).populate({
      path: "cartItems.productId",
      select: "title thumbnail price ingredients stock",
    });
    if (!cart) return res.status(404).json({ message: "no cart for user" });

    let { productId } = req.params;

    const existingItem = cart.cartItems.find(
      (item) => item.productId._id.toString() === productId
    );

    if (!existingItem) {
      return res.status(404).json({ message: "product not found in cart" });
    }
    //filter to remove item from cart

    const filteredCart = cart.cartItems.filter(
      (item) => item.productId._id.toString() !== productId
    );

    if (filteredCart.length !== cart.cartItems.length) {
      cart.cartItems = filteredCart;
      await cart.save();
    }
    const totalItems = cart.cartItems.reduce(
      (acc, item) => acc + item.quantity,
      0
    );
    const subtotal = cart.cartItems.reduce((acc, item) => {
      const product = item.productId;
      if (!product) return acc;
      return acc + product.price * item.quantity;
    }, 0);
    res.status(200).json({
      message: "product in cart items removed successfully",
      data: cart.cartItems,
      totalItems,
      subtotal,
    });
  } catch (err) {
    res.status(500).json({ message: "server error" });
  }
};

const clearCart = async (req, res, userID) => {
  try {
    if (!userID)
      return res
        .status(401)
        .json({ message: "you are not authorized to get this content" });

    let cart = await Cart.findOne({ userID });
    if (!cart) return res.status(404).json({ message: "no cart for user" });
    //empty cartItems
    cart.cartItems = [];
    await cart.save();
    res.status(200).json({ message: "cart items deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "server error" });
  }
};
const getAllCarts = (req, res) => {};
export default {
  addProductToCart,
  getAllCarts,
  getUserCart,
  getCartForCheckout,
  updateCartItem,
  deleteCartItem,
  clearCart,
};
