import { Router } from "express";
import couponControllers from "../controllers/coupon.controller.js";
import couponValidation from "../validation/coupon.validation.js";
import authenticate from "../middlewares/authentication.middleware.js";
import validateRequestBody from "../middlewares/schemaValidation.middleware.js";
import systemRoles from "../utils/systemRoles.js";

const couponRouter = new Router();

couponRouter
  .route("/")
  .get(authenticate([systemRoles.admin]), couponControllers.getAllCoupons)
  .post(
    authenticate([systemRoles.admin]),
    validateRequestBody(couponValidation.addCouponValidation),
    couponControllers.addNewCoupon
  );

couponRouter
  .route("/apply-coupon")
  .post(
    authenticate([systemRoles.user]),
    validateRequestBody(couponValidation.applyCouponValidation),
    (req, res) => {
      couponControllers.applyCoupon(req, res, req.user.id);
    }
  );

couponRouter
  .route("/:id")
  .get(authenticate([systemRoles.admin]), couponControllers.getCouponById)
  .put(
    authenticate([systemRoles.admin]),
    validateRequestBody(couponValidation.updateCouponValidation),
    couponControllers.updateCoupon
  )
  .delete(authenticate([systemRoles.admin]), couponControllers.deleteCoupon);

export default couponRouter;
