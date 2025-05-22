import Ajv from "ajv";
import ajvErrors from "ajv-errors";

const ajv = new Ajv({ allErrors: true });
ajvErrors(ajv); // For custom error messages

const addReviewSchema = {
  type: "object",
  properties: {
    description: { type: "string", minLength: 3 },
    rating: { type: "number", minimum: 0, maximum: 5 },
  },
  required: ["description", "rating"],
  additionalProperties: false,
  errorMessage: {
    required: {
      description: "description is required.",
      rating: "rating is required.",
    },
    properties: {
      description: "description must be at least 3 characters.",
      rating: "rating must be a number that ranges from 0 to 5",
    },
    additionalProperties: "unexpected extra property in request body.",
  },
};

const addReviewValidation = ajv.compile(addReviewSchema);

export default { addReviewValidation };
