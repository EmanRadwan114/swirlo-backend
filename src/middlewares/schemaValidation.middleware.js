const validateRequestBody = (schema) => {
  return (req, res, next) => {
    if (!req.body) {
      return res.status(400).json({
        message: "Request body is required.",
      });
    }
    const valid = schema(req.body);
    const errors = [];

    if (schema.errors) {
      for (const err of schema.errors) {
        errors.push({
          message: err.message,
        });
      }
    }

    if (!valid) {
      return res.status(400).json({
        message: "Validation error",
        errors,
      });
    }

    next();
  };
};

export default validateRequestBody;
