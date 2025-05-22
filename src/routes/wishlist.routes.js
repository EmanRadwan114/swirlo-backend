import { Router } from "express";
import wishlistControllers from "../controllers/wishlist.controller.js";
import authenticate from "../middlewares/authentication.middleware.js";
import systemRoles from "../utils/systemRoles.js";

// import wishlistValidation from "../validation/wishlist.validation.js";

const wishlistRouter = new Router();

//* get all wishlist of current user
wishlistRouter.get(
  "/",
  authenticate(["user"]),
  wishlistControllers.getWishList
);
wishlistRouter.delete(
  "/",
  authenticate([systemRoles.user]),
  wishlistControllers.clearWishlist
);
wishlistRouter.delete(
  "/delete/:pid",
  authenticate(["user"]),
  wishlistControllers.deleteFromWishList
);
wishlistRouter.put(
  "/add/:pid",
  authenticate(["user"]),
  wishlistControllers.addToWishList
);

export default wishlistRouter;
