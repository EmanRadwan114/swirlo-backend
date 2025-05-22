import Ajv from "ajv";
import ajvFormats from "ajv-formats";
import ajvErrors from "ajv-errors";

const ajv = new Ajv({ allErrors: true });
ajvErrors(ajv); // For custom error messages
ajvFormats(ajv); // Add support for formats like 'email', 'date', etc.

const updateUserSchema = {
  type: "object",
  properties: {
    oldPassword: {
      type: "string",
      pattern:
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@_$-])[A-Za-z\\d@_$-]{8,}$",
    },
    newPassword: {
      type: "string",
      pattern:
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@_$-])[A-Za-z\\d@_$-]{8,}$",
    },
    email: {
      type: "string",
      format: "email",
    },
    address: {
      type: "string",
      minLength: 5,
    },
    name: {
      type: "string",
      minLength: 3,
    },
    image: {
      type: "string",
      format: "uri",
    },
  },
  additionalProperties: false,
  errorMessage: {
    properties: {
      oldPassword:
        "password must be at least 8 characters, including uppercase, lowercase, a number, and a special character.",
      newPassword:
        "password must be at least 8 characters, including uppercase, lowercase, a number, and a special character.",
      email: "please enter a valid email address.",
      address: "address must be at least 5 characters.",
      name: "name must be at least 3 characters.",
      image: "image must be a valid URL.",
    },
    additionalProperties: "unexpected extra property in request body.",
  },
};

const updateUserValidation = ajv.compile(updateUserSchema);

export default { updateUserValidation };
