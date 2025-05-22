// ^ express global error handle middleware to send an error response with status code
const globalErrHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({ message: err.message, statusCode });

  next();
};

export default globalErrHandler;
