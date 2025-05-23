import User from "../../db/models/user.model.js";
import Product from "../../db/models/product.model.js";

const addToFavorites = async (req, res) => {
  try {
    const userId = req.user.id;
    const { pid } = req.params;

    const product = await Product.findById(pid);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.favorites.includes(pid)) {
      return res.status(400).json({ message: "Product already in favorites" });
    }

    user.favorites.push(pid);
    await user.save();

    res.status(200).json({
      message: "Product added to favorites",
      favorites: user.favorites,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const getFavorites = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;
    const skip = (page - 1) * limit;
    const all = req.query.all || false;
    const user = await User.findById(req.user.id).populate("favorites");
    if (!user) return res.status(404).json({ message: "User not found" });
    let productsFavorites;
    let total = user.favorites.length;
    if (all) {
      productsFavorites = user.favorites;
    } else {
      productsFavorites = user.favorites.slice(skip, skip + limit);
    }
    res.status(200).json({
      favorites: productsFavorites,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ message: error.message, error });
  }
};

// favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
const deleteFromFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const { pid } = req.params;

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.favorites = user.favorites.filter((item) => item.toString() !== pid);

    await user.save();

    return res
      .status(200)
      .json({ message: "Removed from favorites", favorites: user.favorites });
  } catch (error) {
    console.error("❌ favorites Deletion Error:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

const clearFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.favorites = [];

    await user.save();

    return res.status(200).json({ message: "success" });
  } catch (error) {
    console.error("❌ favorites Deletion Error:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

export default {
  addToFavorites,
  getFavorites,
  deleteFromFavorites,
  clearFavorites,
};
