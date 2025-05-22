import { Router } from "express";
import userControllers from "../controllers/user.controller.js";
import userValidation from "../validation/user.validation.js";
import validateRequestBody from "../middlewares/schemaValidation.middleware.js";
import authenticate from "./../middlewares/authentication.middleware.js";
import systemRoles from "../utils/systemRoles.js";

const userRouter = new Router({ mergeParams: true });

//* get all users
userRouter.get("/", authenticate([systemRoles.admin]), userControllers.getAllUsers);

//* get, update & delete profile ==> both user and admin
userRouter
  .route("/me")
  .get(authenticate(Object.values(systemRoles)), (req, res) => {
    userControllers.getUser(req.user.id, res);
  })
  .put(authenticate(Object.values(systemRoles)), validateRequestBody(userValidation.updateUserValidation), (req, res) => {
    userControllers.updateUser(req, res, req.user.id);
  })
  .delete(authenticate(Object.values(systemRoles)), (req, res) => {
    userControllers.deleteUser(req, res, req.user.id);
  });

//* get user reviews for current user ==> user only
userRouter.get("/reviews/me", authenticate([systemRoles.user]), (req, res) => {
  userControllers.getAllUserReviews(req, req.user.id, res);
});

//* get user reviews for a user by user ID ==> admin only
userRouter.get("/reviews/:id", authenticate([systemRoles.admin]), (req, res) => {
  userControllers.getAllUserReviews(req, req.params.id, res);
});

//* get & delete user by id ==> admin only
userRouter
  .route("/:id")
  .get(authenticate([systemRoles.admin]), (req, res) => {
    userControllers.getUser(req.params.id, res);
  })
  .delete(authenticate([systemRoles.admin]), (req, res) => {
    userControllers.deleteUser(req, res, req.params.id);
  });

export default userRouter;
