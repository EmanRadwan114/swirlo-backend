import Ajv from "ajv";
import ajvFormats from "ajv-formats";
import ajvErrors from "ajv-errors";

const ajv = new Ajv({ allErrors: true });
ajvErrors(ajv); // For custom error messages
ajvFormats(ajv); // Add support for formats like 'email', 'date', etc.

const addUserSchema = {
  type: "object",
  properties: {
    name: {
      type: "string",
      minLength: 3,
    },
    email: {
      type: "string",
      format: "email",
    },
    password: {
      type: "string",
      pattern:
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@_$-])[A-Za-z\\d@_$-]{8,}$",
    },
    role: {
      type: "string",
      enum: ["user", "admin"],
    },
  },
  required: ["name", "email", "password"],
  additionalProperties: false,
  errorMessage: {
    required: {
      name: "name is required.",
      email: "email is required.",
      password: "password is required.",
    },
    properties: {
      name: "name must be at least 3 characters.",
      email: "please enter a valid email address.",
      password:
        "password must be at least 8 characters, with uppercase, lowercase, number, and special character.",
      role: "role must be either 'user' or 'admin'.",
    },
    additionalProperties: "unexpected extra property in request body.",
  },
};

const loginUserSchema = {
  type: "object",
  properties: {
    email: {
      type: "string",
      format: "email",
    },
    password: {
      type: "string",
      pattern:
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@_$-])[A-Za-z\\d@_$-]{8,}$",
    },
  },
  required: ["email", "password"],
  additionalProperties: false,
  errorMessage: {
    required: {
      email: "email is required.",
      password: "password is required.",
    },
    properties: {
      email: "please enter a valid email address.",
      password:
        "password must be at least 8 characters, with uppercase, lowercase, number, and special character.",
    },
    additionalProperties: "unexpected extra property in request body.",
  },
};

const addUserValidation = ajv.compile(addUserSchema);
const loginUserValidation = ajv.compile(loginUserSchema);

export default { addUserValidation, loginUserValidation };
