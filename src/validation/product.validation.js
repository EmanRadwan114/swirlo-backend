import Ajv from "ajv";
import ajvErrors from "ajv-errors";
import ajvFormats from "ajv-formats";

const ajv = new Ajv({ allErrors: true });
ajvErrors(ajv);
ajvFormats(ajv);

const addProductSchema = {
  type: "object",
  required: ["categoryID", "title", "description", "thumbnail", "price"],
  properties: {
    categoryID: { type: "string", pattern: "^[a-fA-F0-9]{24}$" },
    title: { type: "string", minLength: 4 },
    description: { type: "string", minLength: 1 },
    thumbnail: { type: "string", format: "uri" },
    images: {
      type: "array",
      items: { type: "string", format: "uri" },
    },
    price: { type: "number", minimum: 0 },
    avgRating: { type: "number", minimum: 0, maximum: 5 },
    numberOfReviews: { type: "number", minimum: 0 },
    label: {
      type: "array",
      items: { type: "string", enum: ["hot", "trendy", "new arrival"] },
    },
    orderCount: { type: "number", minimum: 0 },
  },
  additionalProperties: false,
  errorMessage: {
    properties: {
      categoryID: "category ID must be a valid ObjectId",
      title: "title is required and must be unique",
      description: "description is required",
      thumbnail: "thumbnail must be a valid URL",
      images: "each image must be a valid URL",
      price: "price must be a number greater than or equal to 0",
      avgRating: "average rating must be a number between 0 and 5",
      numberOfReviews: "number of reviews must be a non-negative number",
      label:
        "label must be an array containing 'hot', 'trendy', or 'new arrival'",
      orderCount: "order count must be a non-negative number",
    },
    additionalProperties: "unexpected extra property in request body",
  },
};
const updateProductSchema = {
  type: "object",
  properties: {
    categoryID: { type: "string", pattern: "^[a-fA-F0-9]{24}$" },
    title: { type: "string", minLength: 4 },
    description: { type: "string", minLength: 10 },
    thumbnail: { type: "string", format: "uri" },
    images: {
      type: "array",
      items: { type: "string", format: "uri" },
    },
    price: { type: "number", minimum: 0 },
    label: {
      type: "array",
      items: { type: "string", enum: ["hot", "trendy", "new arrival"] },
    },
    avgRating: { type: "number", minimum: 0, maximum: 5 },
    numberOfReviews: { type: "number", minimum: 0 },
    orderCount: { type: "number", minimum: 0 },
  },
  additionalProperties: false,
  errorMessage: {
    properties: {
      categoryID: "category ID must be a valid ObjectId",
      title: "title must be at least 4 characters",
      description: "description must be at least 10 characters",
      thumbnail: "thumbnail must be a valid URL",
      images: "images must be valid URLs",
      price: "price must be a non-negative number",
      avgRating: "average rating must be a number between 0 and 5",
      numberOfReviews: "number of reviews must be a non-negative number",
      label:
        "label must be an array containing 'hot', 'trendy', or 'new arrival'",
      orderCount: "order count must be a non-negative number",
    },
    additionalProperties: "unexpected extra property in request body",
  },
};

const addProductValidation = ajv.compile(addProductSchema);
const updateProductValidation = ajv.compile(updateProductSchema);

export default { addProductValidation, updateProductValidation };
