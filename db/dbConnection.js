import mongoose from "mongoose";

const { connect, connection } = mongoose;

connect(process.env.MONGODB_CONNECTION_URL)
  .then(() => {
    console.log("Database connected successfully.");
  })
  .catch((err) => {
    console.error("Error connecting to the database:", err);
  });

const db = connection;

export default db;
