import { Schema, model, Types } from "mongoose";

const couponSchema = new Schema(
  {
    CouponCode: { type: String, required: true, unique: true },
    CouponUsers: [{ type: Types.ObjectId, ref: "User" }],
    CouponPercentage: { type: Number, required: true },
    expirationDate: { type: Date, required: true },
    maxUsageLimit: { type: Number, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true, versionKey: false }
);

const Coupon = model("Coupon", couponSchema);
export default Coupon;
