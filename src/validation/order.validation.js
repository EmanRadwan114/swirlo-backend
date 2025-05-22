import Ajv from "ajv";
import ajvErrors from "ajv-errors";

const ajv = new Ajv({ allErrors: true });
ajvErrors(ajv); // For custom error messages

export const createOrderSchema = {
  type: "object",
  additionalProperties: false,
  required: ["shippingAddress", "paymentMethod", "totalPrice"],
  properties: {
    shippingAddress: {
      type: "string",
      minLength: 1,
    },
    paymentMethod: {
      type: "string",
      enum: ["cash", "online"],
    },
    couponCode: {
      type: "string",
      minLength: 1,
    },
    totalPrice: {
      type: "number",
    },
  },
  errorMessage: {
    required: {
      shippingAddress:
        "shippingAddress is required and must be a non-empty string",
      paymentMethod:
        "paymentMethod is required and must be either 'cash' or 'online'",
      totalPrice: "total price is required'",
    },
    properties: {
      shippingAddress: "shippingAddress must be a non-empty string",
      paymentMethod: "paymentMethod must be one of 'cash' or 'online'",
      couponCode: "couponCode, if provided, must be a non-empty string",
      totalPrice: "total price is required'",
    },
    additionalProperties: "unexpected extra property in request body",
  },
};

const updateOrderSchema = {
  type: "object",
  properties: {
    shippingStatus: {
      type: "string",
      enum: ["pending", "prepared", "shipped"],
    },
  },
  additionalProperties: false,
  errorMessage: {
    properties: {
      shippingStatus:
        "shipping status must be one of the following: pending, prepared or shipped",
    },
    additionalProperties: "unexpected extra property in request body",
  },
};

const createOrderValidation = ajv.compile(createOrderSchema);
const updateOrderValidation = ajv.compile(updateOrderSchema);

export default { createOrderValidation, updateOrderValidation };
