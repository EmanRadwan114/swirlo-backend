// ^--------------------Imports
import { Router } from "express";
import orderControllers from "../controllers/order.controller.js";
import orderValidation from "../validation/order.validation.js";
import authenticate from "./../middlewares/authentication.middleware.js";
import systemRoles from "./../utils/systemRoles.js";
import validateRequestBody from "./../middlewares/schemaValidation.middleware.js";

const orderRouter = new Router();

// ^---------------------------GET All Orders & POST Neww Order----------------------
orderRouter
  .route("/")
  .get(authenticate([systemRoles.admin]), orderControllers.getAllOrders)
  .post(
    authenticate([systemRoles.user]),
    validateRequestBody(orderValidation.createOrderValidation),
    orderControllers.createOrder
  );

// ^----------------------------------GET All User Orders--------------------------
orderRouter
  .route("/me")
  .get(
    authenticate(Object.values(systemRoles)),
    orderControllers.getUserOrders
  );

// ^----------------------------------GET Orders By Month--------------------------
orderRouter.get(
  "/orders-by-month",
  authenticate([systemRoles.admin]),
  orderControllers.getOrdersByMonth
);

// ^----------------------------------GET, PUT & DELETE Order By ID--------------------------
orderRouter
  .route("/:id")
  .get(authenticate(Object.values(systemRoles)), orderControllers.getOrderByID)
  .put(
    authenticate([systemRoles.admin]),
    validateRequestBody(orderValidation.updateOrderValidation),
    orderControllers.updateOrderByID
  )
  .delete(authenticate([systemRoles.admin]), orderControllers.deleteOrderByID);

export default orderRouter;
