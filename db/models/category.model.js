import { Schema, model } from "mongoose";

const categorySchema = new Schema(
  {
    name: { type: String, required: true },
    thumbnail: { type: String, required: true },
  },
  { timestamps: true, versionKey: false }
);

const Category = model("Category", categorySchema);
export default Category;
