import { Schema, model, Types } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String, required: [true, "name is required"] },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "password is required"],
    },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    wishlist: [
      {
        type: Types.ObjectId,
        ref: "Product",
      },
    ],
    isEmailActive: { type: Boolean, default: false },
    image: {
      type: String,
      default:
        "https://img.freepik.com/free-vector/illustration-user-avatar-icon_53876-5907.jpg?uid=R194767243&ga=GA1.1.1957810835.1742649565&semt=ais_hybrid&w=740",
    },
    address: [{ type: String }],
  },
  { timestamps: true, versionKey: false }
);

//*Role-based wishlist validation
userSchema.path("wishlist").validate(function (value) {
  if (this.role === "admin" && value.length > 0) {
    return false;
  }
  return true;
}, "Admins cannot have a wishlist");

//*Role-based address validation
userSchema.path("address").validate(function (value) {
  if (this.role === "admin" && value.length > 0) {
    return false;
  }
  return true;
}, "Admins cannot have an address");

const User = model("User", userSchema);
export default User;
