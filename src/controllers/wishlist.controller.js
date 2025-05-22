import User from "../../db/models/user.model.js";
import Product from "../../db/models/product.model.js";

const addToWishList = async (req, res) => {
  try {
    const userId = req.user.id;
    const { pid } = req.params;

    const product = await Product.findById(pid);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.wishlist.includes(pid)) {
      return res.status(400).json({ message: "Product already in wishlist" });
    }

    user.wishlist.push(pid);
    await user.save();

    res
      .status(200)
      .json({ message: "Product added to wishlist", wishlist: user.wishlist });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const getWishList = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;
    const skip = (page - 1) * limit;
    const all = req.query.all || false;
    const user = await User.findById(req.user.id).populate("wishlist");
    if (!user) return res.status(404).json({ message: "User not found" });
    let productsWishList;
    let total = user.wishlist.length;
    if (all) {
      productsWishList = user.wishlist;
    } else {
      productsWishList = user.wishlist.slice(skip, skip + limit);
    }
    res.status(200).json({
      wishlist: productsWishList,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ message: error.message, error });
  }
};

// wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
const deleteFromWishList = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const { pid } = req.params;

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.wishlist = user.wishlist.filter((item) => item.toString() !== pid);

    await user.save();

    return res
      .status(200)
      .json({ message: "Removed from wishlist", wishlist: user.wishlist });
  } catch (error) {
    console.error("❌ Wishlist Deletion Error:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

const clearWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.wishlist = [];

    await user.save();

    return res.status(200).json({ message: "success" });
  } catch (error) {
    console.error("❌ Wishlist Deletion Error:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

export default {
  addToWishList,
  getWishList,
  deleteFromWishList,
  clearWishlist,
};
