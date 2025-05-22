import { Schema, model, Types } from "mongoose";

const cartSchema = new Schema(
  {
    userID: { type: Types.ObjectId, ref: "User", required: [true, "user is required"] },
    cartItems: [
      {
        productId: { type: Types.ObjectId, ref: "Product", required: [true, "product is required"] },
        quantity: { type: Number, required: true, default: 1 },
      },
    ],
  },
  { timestamps: true, versionKey: false }
);

const Cart = model("Cart", cartSchema);
export default Cart;
