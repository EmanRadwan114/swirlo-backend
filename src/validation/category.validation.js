import Ajv from "ajv";
import ajvErrors from "ajv-errors";
import ajvFormats from "ajv-formats";

const ajv = new Ajv({ allErrors: true }); // Needed for ajv-errors
ajvErrors(ajv);
ajvFormats(ajv);

const addCategorySchema = {
  type: "object",
  properties: {
    name: { type: "string", minLength: 3 },
    thumbnail: { type: "string", format: "uri" },
  },
  required: ["name", "thumbnail"],

  additionalProperties: false,

  errorMessage: {
    properties: {
      name: "name must be at least 3 characters.",
      thumbnail: "thumbnail must be a valid URL.",
    },
    additionalProperties: "No extra fields allowed.",
  },
};
const updateCategorySchema = {
  type: "object",
  properties: {
    name: { type: "string", minLength: 3 },
    thumbnail: { type: "string", format: "uri" },
  },
  additionalProperties: false,
  errorMessage: {
    properties: {
      name: "name must be at least 3 characters.",
      thumbnail: "thumbnail must be a valid URL.",
    },
    additionalProperties: "No extra fields allowed.",
  },
};

const addCategoryValidation = ajv.compile(addCategorySchema);
const updateCategoryValidation = ajv.compile(updateCategorySchema);

export default { addCategoryValidation, updateCategoryValidation };
