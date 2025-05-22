import { Schema, model, Types } from "mongoose";

const orderSchema = new Schema(
  {
    userID: { type: Types.ObjectId, ref: "User" },
    totalPrice: { type: Number, required: true },
    orderItems: [
      {
        productId: { type: Types.ObjectId, ref: "Product" },
        quantity: { type: Number, required: true },
      },
    ],
    shippingAddress: { type: String, required: true },
    paymentMethod: {
      type: String,
      enum: ["cash", "online"],
      default: "cash",
      required: true,
    },
    orderStatus: {
      type: String,
      enum: ["paid", "waiting"],
      default: "waiting", // for both cash and online
    },
    shippingStatus: {
      type: String,
      enum: ["pending", "prepared", "shipped"],
      default: "pending",
    },
  },
  { timestamps: true, versionKey: false }
);

const Order = model("Order", orderSchema);
export default Order;
