import jwt from "jsonwebtoken";

const generateToken = (tokenPayload, secretKey, expiryDate) => {
  const payload = { ...tokenPayload };
  const options = {};

  if (expiryDate) {
    options.expiresIn = expiryDate;
  }

  const token = jwt.sign(payload, secretKey, options);
  return token;
};

export default generateToken;
