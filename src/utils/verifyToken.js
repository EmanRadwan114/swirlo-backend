import jwt from "jsonwebtoken";

const verifyToken = (token, secretKey) => {
  try {
    const decoded = jwt.verify(token, secretKey);
    return decoded;
  } catch (error) {
    console.error("Invalid token:", error.message);
    return null;
  }
};

export default verifyToken;
