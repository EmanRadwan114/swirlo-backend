// ^--------------------Imports
import { Router } from "express";
import cartControllers from "../controllers/cart.controller.js";
import cartValidation from "../validation/cart.validation.js";
import validateRequestBody from "../middlewares/schemaValidation.middleware.js";
import systemRoles from "../utils/systemRoles.js";
import authenticate from "../middlewares/authentication.middleware.js";
const cartRouter = new Router();
cartRouter
  .route("/")
  .get(authenticate([systemRoles.user]), (req, res) => {
    cartControllers.getUserCart(req, res, req.user.id);
  })
  .post(
    authenticate([systemRoles.user]),
    validateRequestBody(cartValidation.addCartValidation),
    (req, res) => {
      cartControllers.addProductToCart(req, res, req.user.id);
    }
  )
  .delete(authenticate([systemRoles.user]), (req, res) => {
    cartControllers.clearCart(req, res, req.user.id);
  });

cartRouter.get("/checkout",authenticate([systemRoles.user]),(req, res) => {
  cartControllers.getCartForCheckout(req,res, req.user.id);
})
cartRouter
  .route("/:productId")
  .put(
    authenticate([systemRoles.user]),
    validateRequestBody(cartValidation.updateCartValidation),
    (req, res) => {
      cartControllers.updateCartItem(req, res, req.user.id);
    }
  )
  .delete(authenticate([systemRoles.user]), (req, res) => {
    cartControllers.deleteCartItem(req, res, req.user.id);
  });
export default cartRouter;
