import Review from "../../db/models/review.model.js";
import generateAndSendActivationEmail from "../utils/emailActivation.js";
import generateToken from "../utils/generateToken.js";
import User from "./../../db/models/user.model.js";
import bcrypt from "bcrypt";

// ^----------------------------------Get All Users--------------------------
const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;

    const role = req.query.role; // Optional filter

    // Build filter object
    const filter = {};
    if (role) {
      filter.role = role;
    }

    // Get total count *after* applying filter
    const total = await User.countDocuments(filter);

    const users = await User.find(filter)
      .skip(skip)
      .limit(limit)
      .select("name email role favorites image address isEmailActive")
      .sort({ createdAt: -1 });

    if (users.length === 0) {
      return res.status(404).json({ message: "no users found" });
    }

    res.status(200).json({
      message: "success",
      data: users,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ message: "server error" });
  }
};

// ^---------------------------Get User (ID in Params / ID in Token)------------------------
const getUser = async (userID, res) => {
  try {
    if (!userID)
      return res
        .status(401)
        .json({ message: "you are not authorized to get this content" });

    const user = await User.findById(userID).select(
      "-updatedAt -password -isEmailActive"
    );

    if (!user) return res.status(404).json({ message: "user is not found" });

    res.status(200).json({ message: "success", data: user });
  } catch (err) {
    res.status(500).json({ message: "server error" });
  }
};

// ^-----------------------------Update User (ID in Params / ID in Token)-----------------------
const updateUser = async (req, res, userID) => {
  try {
    if (!userID)
      return res
        .status(401)
        .json({ message: "you are not authorized to get this content" });

    const { oldPassword, newPassword, email, address, name, image } = req.body;

    const user = await User.findById(userID);

    if (!user) return res.status(404).json({ message: "user is not found" });

    // * change password
    if (oldPassword && newPassword) {
      const isPasswordCorrect = await bcrypt.compare(
        oldPassword,
        user.password
      );

      if (!isPasswordCorrect)
        return res.status(401).json({ message: "incorrect password" });

      user.password = await bcrypt.hash(
        newPassword,
        +process.env.USER_PASS_SALT_ROUNDS
      );

      generateAndSendActivationEmail(user);
    }

    // * change name
    if (name && name !== user.name) {
      user.name = name;
    }

    // * change image
    if (image && image !== user.image) {
      user.image = image;
    }

    // * change address (if new and not already exists)
    if (address && user.role == "admin")
      return res.status(400).json({ message: "admin cannot have address" });
    else if (
      address &&
      user.role !== "admin" &&
      !user.address.includes(address)
    ) {
      user.address.push(address);
    }

    if (email && email !== user.email) {
      // * change email
      const isEmailExists = await User.findOne({ email });

      if (isEmailExists)
        return res.status(409).json({ message: "this email already exists" });

      user.email = email;
      user.isEmailActive = false;
      await user.save(); //? save before redirecting
      generateAndSendActivationEmail(user);
    }

    await user.save();

    const updatedUser = await User.findById(userID).select(
      "-createdAt -updatedAt -password -isEmailActive"
    );

    res
      .status(200)
      .json({ message: "user is updated successfully", data: updatedUser });
  } catch (err) {
    res.status(500).json({ message: "server error" });
  }
};

// ^-------------------------Delete User (ID in Params / ID in Token)------------------------
const deleteUser = async (req, res, userID) => {
  try {
    if (!userID)
      return res
        .status(401)
        .json({ message: "you are not authorized to get this content" });

    const user = await User.findByIdAndDelete(userID).select("name email role");

    if (!user) return res.status(404).json({ message: "user is not found" });

    if (req.user.id == user.id) {
      const token = generateToken(
        { id: user.id },
        process.env.USER_TOKEN_SECRET_KEY,
        "5s"
      );

      res.cookie("token", token, {
        httpOnly: true,
        sameSite: "none", // Change from "none" to "lax" for development
        secure: true, // Keep false for HTTP in development
        maxAge: 10000,
        path: "/",
      });
    }

    res
      .status(200)
      .json({ message: "user is deleted successfully", data: user });
  } catch (err) {
    res.status(500).json({ message: "server error" });
  }
};

// ^-----------------------------GET All User Reviews-----------------------
const getAllUserReviews = async (req, userID, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const total = await Review.countDocuments({ userID });
    const reviews = await Review.find({
      userID,
    })
      .populate("userID", "name email image")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    if (reviews.length === 0)
      return res
        .status(404)
        .json({ message: "no reviews added for this user" });

    const userReviews = reviews.map((item) => {
      const { userID, ...rest } = item.toObject();

      return {
        ...rest,
        user: userID,
      };
    });

    res.status(200).json({
      message: "success",
      data: userReviews,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export default {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  getAllUserReviews,
};
