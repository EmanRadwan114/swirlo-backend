import Category from "../../db/models/category.model.js";
import Product from "../../db/models/product.model.js";

// ^----------------------------------Add Category--------------------------

const addNewCategory = async (req, res) => {
  try {
    let { name, thumbnail } = req.body;

    const lowerCaseName = name.trim().toLowerCase();

    // make sure name isn't duplicated
    const existing = await Category.findOne({
      name: { $regex: `^${lowerCaseName}$`, $options: "i" },
    });

    if (existing) {
      return res.status(409).json({ message: "Category already exist" });
    }
    const category = new Category({ name, thumbnail });
    await category.save();

    res
      .status(200)
      .json({ message: "Category added Successfully", data: category });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

// ^---------------------------------- Get All Categories --------------------------

const getAllCategories = async (req, res) => {
  try {
    let categories = await Category.find().sort({ createdAt: -1 });
    res.status(200).json({ message: "Categories founded", data: categories });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};
// ^----------------------------------Get One Category --------------------------

const getCategoryById = async (req, res) => {
  try {
    
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(400).json({ message: "Category not found" });
    }
    res.status(200).json({ message: "Category found", data: category });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

// ^----------------------------------Update Category By ID--------------------------

const updateCategory = async (req, res) => {
  try {
    let { name, thumbnail } = req.body;
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name, thumbnail },
      { new: true, runValidators: true }
    );
    if (!category) {
      res.status(400).json({ message: "category not found" });
    }
    res
      .status(200)
      .json({ message: "Category updated successfully", data: category });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

// ^----------------------------------Delete Category By ID--------------------------

const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(400).json({ message: "category not found" });
    }
    // Delete all products that belong to this category
    await Product.deleteMany({
      categoryID: req.params.id,
    });

    res
      .status(200)
      .json({ message: "Category and its products deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

export default {
  addNewCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
