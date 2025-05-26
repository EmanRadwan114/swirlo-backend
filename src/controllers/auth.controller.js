import bcrypt from "bcrypt";
import { OAuth2Client } from "google-auth-library";
import User from "../../db/models/user.model.js";
import generateToken from "../utils/generateToken.js";
import verifyToken from "../utils/verifyToken.js";
import generateAndSendActivationEmail from "../utils/emailActivation.js";
import crypto from "crypto";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ^----------------------------------Registeration--------------------------
const RegisterUser = async (req, res) => {
  try {
    //* 1- check if email exists or not
    const { name, email, password } = req.body;

    if (!email)
      return res.status(400).json({ message: "please provide user email" });

    const user = await User.findOne({ email });

    if (user) {
      return res.status(409).json({ message: "email already exists" });
    }

    //* 2- hashing password
    const hashedPassword = await bcrypt.hash(
      password,
      +process.env.USER_PASS_SALT_ROUNDS
    );

    //* 3- save in db
    const newUser = new User({ ...req.body, password: hashedPassword });

    await newUser.save();

    //* 4- generate token for email activation
    generateAndSendActivationEmail(newUser);

    //* 6- send success msg
    res.status(201).json({
      message:
        "user registered successfully. we have sent an email activation link to your email.",
      user: {
        id: newUser._id,
        name,
        email,
        isEmailActive: newUser.isEmailActive,
        role: newUser.role,
      },
    });
  } catch (err) {
    // * handle validation error => eg: when not passing required field
    if (err.name === "ValidationError") {
      const errors = {};

      for (let field in err.errors) {
        errors[field] = err.errors[field].message;
      }
      return res.status(400).json({ message: "validation error", errors });
    }

    res.status(500).json({ message: "server error" });
  }
};

// ^----------------------------------Email Activation--------------------------
const emailActivation = async (req, res) => {
  try {
    //* 1- get token and verify it
    const { token } = req.params;

    const decoded = verifyToken(
      token,
      process.env.EMAIL_ACTIVATION_TOKEN_SECRET_KEY
    );

    //* 2- get the user and activate their email
    const user = await User.findById({ _id: decoded.id });

    if (user && !user.isEmailActive) {
      user.isEmailActive = true;
      await user.save();

      //* 3- redirect user to the login form
      return res.status(302).redirect(`${process.env.FRONT_URL}/login`);
    } else if (user && user.isEmailActive) {
      return res.status(409).json({ message: "Email is already activated" });
    } else {
      return res.status(400).json({ message: "User token is invalid" });
    }
  } catch (err) {
    //* 4- handle expired or invalid token
    return res.status(401).json({
      message: "Activation link has expired. Please request a new one.",
    });
  }
};

// ^----------------------------------Login--------------------------
const signIn = async (req, res) => {
  try {
    //* 1- check if email exists or not
    const { email, password } = req.body;

    if (!email)
      return res.status(400).json({ message: "please provide user email" });

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "email does not exist" });
    }

    if (!user.isEmailActive)
      return res.status(400).json({
        message:
          "your email is not active. you can activate it using the activation link sent to your email",
      });

    //* 2- check if password is correct or not
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect)
      return res.status(401).json({ message: "incorrect password" });

    //* 3- generate user token
    const token = generateToken(
      { email: user.email, id: user._id, role: user.role },
      process.env.USER_TOKEN_SECRET_KEY,
      "7d"
    );

    //* 4- send token in http-only cookie to prevent js access
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "none", // Change from "none" to "lax" for development
      secure: true, // Keep false for HTTP in development
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
      path: "/", // Ensure cookie is available on all paths
    });

    //* 4- send success msg
    res.status(200).json({
      message: "successful login",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isEmailActive: user.isEmailActive,
        role: user.role,
        image: user.image,
        address: user.address,
      },
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      const errors = {};

      for (let field in err.errors) {
        errors[field] = err.errors[field].message;
      }
      return res.status(400).json({ message: "validation error", errors });
    }

    res.status(500).json({ message: "server error" });
  }
};

// ^----------------------------------Login using google API--------------------------
const signInWithGoogle = async (req, res) => {
  try {
    //* 1- check if email exists or not
    const { token } = req.body;

    if (!token)
      return res
        .status(400)
        .json({ message: "please provide valid user token" });

    //* Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const { email, name } = payload;

    //* Verify email
    if (!email)
      return res
        .status(400)
        .json({ message: "please provide valid user email" });

    const user = await User.findOne({ email });

    let newUser;

    if (!user) {
      const randomPassword = crypto.randomBytes(32).toString("hex"); // 64 characters
      const hashedPassword = await bcrypt.hash(
        randomPassword,
        +process.env.USER_PASS_SALT_ROUNDS
      );

      newUser = new User({
        email,
        name,
        password: hashedPassword,
        isEmailActive: true,
      });
      await newUser.save();
    }

    //* 3- generate user token
    const userToken = generateToken(
      {
        email: user?.email || newUser?.email,
        id: user?._id || newUser?._id,
        role: user?.role || newUser?.role,
      },
      process.env.USER_TOKEN_SECRET_KEY,
      "7d"
    );

    //* 4- send token in http-only cookie to prevent js access
    res.cookie("token", userToken, {
      httpOnly: true,
      sameSite: "none", // Change from "none" to "lax" for development
      secure: true, // Keep false for HTTP in development
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
      path: "/", // Ensure cookie is available on all paths
    });

    //* 4- send success msg
    res.status(200).json({
      message: "successful login",
      user: {
        id: user?._id || newUser._id,
        name: user?.name || newUser?.name,
        email: user?.email || newUser?.email,
        isEmailActive: user?.isEmailActive || newUser?.isEmailActive,
        role: user?.role || newUser?.role,
        image: user?.image || newUser?.image,
        address: user?.address || newUser?.address,
      },
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      const errors = {};

      for (let field in err.errors) {
        errors[field] = err.errors[field].message;
      }
      return res.status(400).json({ message: "validation error", errors });
    }

    res.status(500).json({ message: "server error" });
  }
};

const forgetPassword = (req, res) => {}; //additional feature

const resetPassword = (req, res) => {}; //additional feature

// ^----------------------------------LogOut--------------------------
const logOut = async (req, res) => {
  const id = req.user.id;

  const user = await User.findById(id).select("name email role");

  const token = generateToken(
    { email: user.email, id: user._id, role: user.role },
    process.env.USER_TOKEN_SECRET_KEY,
    "10s" // Token expires in 10 seconds
  );

  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "none", // Change from "none" to "lax" for development
    secure: true, // Keep false for HTTP in development
    maxAge: 10000,
    path: "/",
  });

  res
    .status(200)
    .json({ message: "user is logged out successfully", data: user });
};

export default {
  RegisterUser,
  emailActivation,
  signIn,
  signInWithGoogle,
  logOut,
  forgetPassword,
  resetPassword,
};
