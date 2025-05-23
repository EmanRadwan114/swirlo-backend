import { Router } from "express";
import favoritesControllers from "../controllers/favorites.controller.js";
import authenticate from "../middlewares/authentication.middleware.js";
import systemRoles from "../utils/systemRoles.js";

// import favoritesValidation from "../validation/favorites.validation.js";

const favoritesRouter = new Router();

//* get all favorites of current user
favoritesRouter
  .route("/")
  .get(authenticate([systemRoles.user]), favoritesControllers.getFavorites)
  .delete(
    authenticate([systemRoles.user]),
    favoritesControllers.clearFavorites
  );
favoritesRouter
  .route("/:pid")
  .put(authenticate([systemRoles.user]), favoritesControllers.addToFavorites)
  .delete(
    authenticate([systemRoles.user]),
    favoritesControllers.deleteFromFavorites
  );

export default favoritesRouter;
