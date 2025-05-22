import { Schema, model, Types } from "mongoose";

const reviewSchema = new Schema(
  {
    userID: { type: Types.ObjectId, ref: "User" },
    productID: { type: Types.ObjectId, ref: "Product" },
    description: { type: String },
    rating: { type: Number, min: 1, max: 5 },
  },
  { timestamps: true, versionKey: false }
);

const Review = model("Review", reviewSchema);
export default Review;
