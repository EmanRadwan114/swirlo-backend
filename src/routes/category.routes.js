// ^--------------------Imports
import { Router } from "express";
import categoryControllers from "../controllers/category.controller.js";
import categoryValidation from "../validation/category.validation.js";
import validateRequestBody from "../middlewares/schemaValidation.middleware.js";
import authenticate from "./../middlewares/authentication.middleware.js";
import systemRoles from "../utils/systemRoles.js";

const categoryRouter = new Router();

// add category
categoryRouter.post(
  "/add",
  authenticate([systemRoles.admin]),
  validateRequestBody(categoryValidation.addCategoryValidation),
  categoryControllers.addNewCategory
);

// get all categories
categoryRouter.get(
  "/",
  categoryControllers.getAllCategories
);
// get category by id
categoryRouter.get(
  "/:id",
  categoryControllers.getCategoryById
);

// update category by id
categoryRouter.put(
  "/:id",
  authenticate([systemRoles.admin]),
  validateRequestBody(categoryValidation.updateCategoryValidation),
  categoryControllers.updateCategory
);

// delete category by id
categoryRouter.delete(
  "/:id",
  authenticate([systemRoles.admin]),
  categoryControllers.deleteCategory
);

export default categoryRouter;
