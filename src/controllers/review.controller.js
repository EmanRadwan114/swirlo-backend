import Order from "../../db/models/order.model.js";
import Product from "../../db/models/product.model.js";
import Review from "./../../db/models/review.model.js";
import User from "./../../db/models/user.model.js";

// ^-----------------------------GET All Product Reviews-----------------------
const getAllProductReviews = async (req, res) => {
  try {
    const productID = req.params.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 3;
    const skip = (page - 1) * limit;

    const total = await Review.countDocuments({ productID });
    const reviews = await Review.find({ productID })
      .skip(skip)
      .limit(limit)
      .populate("userID", "name email image")
      .sort({ createdAt: -1 });

    if (reviews.length === 0)
      return res
        .status(200)
        .json({ message: "no reviews added for this product", data: reviews });

    const productReviews = reviews.map((item) => {
      const { userID, ...rest } = item.toObject();

      return {
        ...rest,
        user: userID,
      };
    });

    res.status(200).json({
      message: "success",
      data: productReviews,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ message: "server error" });
  }
};

// ^-----------------------------POST New Product Review-----------------------
const addNewProductReview = async (req, res) => {
  try {
    const { rating } = req.body;

    const userID = req.user.id;
    const productID = req.params.id;

    const product = await Product.findById(productID);

    if (!product)
      return res.status(404).json({ message: "product is not found" });

    // *check if the user bought this product before && if it is shipped
    const userOrders = await Order.find({ userID });

    if (userOrders.length === 0)
      return res
        .status(404)
        .json({ message: "no orders requested by this user" });

    let orderID = null,
      hasOrderedProduct = false;

    userOrders.map((order) => {
      const productIDs = order.orderItems.map((item) =>
        item.productId.toString()
      );
      if (productIDs.includes(productID)) {
        hasOrderedProduct = true;
        orderID = order._id;
      }
    });

    if (!hasOrderedProduct) {
      return res.status(400).json({
        message: "you cannot review this product before ordering it.",
      });
    }

    const order = await Order.findById(orderID);

    if (order.shippingStatus !== "shipped")
      return res.status(400).json({
        message: "you cannot review this product before it is shipped to you.",
      });

    // *check if the user wrote a review on this product before
    const userReview = await Review.find({ userID, productID });

    if (userReview.length >= 1)
      return res.status(409).json({
        message: "you have already reviewed this product before",
      });

    // *add user review
    const newReview = new Review({ ...req.body, userID, productID });
    await newReview.save();

    // *change product avgRate and NumberOfReviews
    product.avgRating = +(
      (product.avgRating * product.numberOfReviews + rating) /
      (product.numberOfReviews + 1)
    ).toFixed(1);

    product.numberOfReviews += 1;

    await product.save();

    res.status(201).json({
      message: "success",
      data: {
        _id: newReview._id,
        description: newReview.description,
        rating: newReview.rating,
        productID: newReview.productID,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "server error" });
  }
};

// ^-----------------------------DELETE Product Review By ID-----------------------
const deleteProductReviewByID = async (req, res) => {
  try {
    const productID = req.params.id;
    const reviewID = req.params.reviewID;

    const product = await Product.findById(productID);

    if (!product)
      return res.status(404).json({ message: "product is not found" });

    const review = await Review.findOneAndDelete({ _id: reviewID, productID });

    if (!review)
      return res.status(404).json({ message: "review is not found" });

    res.status(200).json({ message: "success" });
  } catch (err) {
    res.status(500).json({ message: "server error" });
  }
};

export default {
  addNewProductReview,
  getAllProductReviews,
  deleteProductReviewByID,
};
