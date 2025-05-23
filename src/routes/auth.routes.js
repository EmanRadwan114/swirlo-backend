// ^--------------------Imports
import { Router } from "express";
import userControllers from "../controllers/auth.controller.js";
import authValidation from "../validation/auth.validation.js";
import validateRequestBody from "../middlewares/schemaValidation.middleware.js";
import authenticate from "../middlewares/authentication.middleware.js";
import systemRoles from "../utils/systemRoles.js";

const authRouter = new Router();

//* user registeration
authRouter.post(
  "/register",
  validateRequestBody(authValidation.addUserValidation),
  userControllers.RegisterUser
);

//* email activation
authRouter.get("/email-activation/:token", userControllers.emailActivation);

//* user login
authRouter.post(
  "/login",
  validateRequestBody(authValidation.loginUserValidation),
  userControllers.signIn
);

authRouter.post("/login/google", userControllers.signInWithGoogle);

//* user logout
authRouter.post(
  "/logout",
  authenticate(Object.values(systemRoles)),
  userControllers.logOut
);

export default authRouter;
