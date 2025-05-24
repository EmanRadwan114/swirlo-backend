import { Schema, model, Types } from "mongoose";

const productSchema = new Schema(
  {
    categoryID: {
      type: Types.ObjectId,
      ref: "Category",
      required: [true, "category is required"],
    },
    title: {
      type: String,
      required: [true, "product's name is required"],
      unique: true,
    },
    description: {
      type: String,
      required: [true, "product's description is required"],
    },
    thumbnail: {
      type: String,
      required: [true, "product's image is required"],
    },
    images: [{ type: String }],
    price: { type: Number, required: [true, "product's price is required"] },
    avgRating: { type: Number, default: 0 },
    numberOfReviews: { type: Number, default: 0 },
    label: [{ type: String }],
    orderCount: { type: Number, default: 0 },
  },
  { timestamps: true, versionKey: false }
);

const Product = model("Product", productSchema);
export default Product;
