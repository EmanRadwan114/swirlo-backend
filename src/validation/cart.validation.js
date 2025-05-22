import Ajv from "ajv";
import ajvErrors from "ajv-errors";
import ajvFormats from "ajv-formats";

const ajv = new Ajv({ allErrors: true });
ajvErrors(ajv);
ajvFormats(ajv);

const addCartSchema = {
  type: "object",
  required: ["productId"],
  properties: {
    productId: {
      type: "string",
      pattern: "^[a-fA-F0-9]{24}$",
    },
  },
  additionalProperties: false,
  errorMessage: {
    properties: {
      productId: "product id must be a valid ObjectId",
    },
    additionalProperties: "unexpected extra field in request body",
  },
};
const updateCartSchema = {
  type: "object",
  required: ["quantity"],
  properties: {
    quantity: {
      type: "number",
      minimum: 1,
    },
  },
  additionalProperties: false,
  errorMessage: {
    properties: {
      quantity: "quantity must be a number greater than or equal to 1",
    },
    additionalProperties: "unexpected extra field in request body",
  },
};
const addCartValidation = ajv.compile(addCartSchema);
const updateCartValidation = ajv.compile(updateCartSchema);

export default { addCartValidation, updateCartValidation };
