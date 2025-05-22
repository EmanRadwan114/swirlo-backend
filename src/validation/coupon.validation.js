import Ajv from "ajv";
import addFormats from "ajv-formats";

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

const addCouponSchema = {
  type: "object",
  properties: {
    CouponCode: { type: "string", minLength: 3 },
    CouponPercentage: { type: "number", minimum: 1, maximum: 100 },
    expirationDate: { type: "string", format: "date" },
    maxUsageLimit: { type: "number", minimum: 1 },
    isActive: { type: "boolean" },
  },
  required: [
    "CouponCode",
    "CouponPercentage",
    "expirationDate",
    "maxUsageLimit",
  ],
  additionalProperties: false,
};

const updateCouponSchema = {
  type: "object",
  properties: {
    CouponCode: { type: "string", minLength: 3 },
    CouponPercentage: { type: "number", minimum: 1, maximum: 100 },
    expirationDate: { type: "string", format: "date" },
    maxUsageLimit: { type: "number", minimum: 1 },
    isActive: { type: "boolean" },
  },
  additionalProperties: false,
};

const applyCouponSchema = {
  type: "object",
  properties: {
    couponCode: { type: "string", minLength: 1 },
  },
  required: ["couponCode"],
  additionalProperties: false,
};

export default {
  addCouponValidation: ajv.compile(addCouponSchema),
  updateCouponValidation: ajv.compile(updateCouponSchema),
  applyCouponValidation: ajv.compile(applyCouponSchema),
};
