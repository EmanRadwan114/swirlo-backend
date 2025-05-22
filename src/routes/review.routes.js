// ^--------------------Imports
import { Router } from "express";
import reviewControllers from "../controllers/review.controller.js";
import reviewValidation from "../validation/review.validation.js";
import authenticate from "../middlewares/authentication.middleware.js";
import systemRoles from "../utils/systemRoles.js";
import validateRequestBody from "../middlewares/schemaValidation.middleware.js";

const reviewRouter = new Router({ mergeParams: true });

// ^-----------------------------GET All Product Reviews & POST New Review-----------------------
reviewRouter
  .route("/")
  .get(reviewControllers.getAllProductReviews)
  .post(
    authenticate([systemRoles.user]),
    validateRequestBody(reviewValidation.addReviewValidation),
    reviewControllers.addNewProductReview
  );

// ^-----------------------------DELETE Product Review By ID-----------------------
reviewRouter.delete(
  "/:reviewID",
  authenticate([systemRoles.admin]),
  reviewControllers.deleteProductReviewByID
);

export default reviewRouter;
