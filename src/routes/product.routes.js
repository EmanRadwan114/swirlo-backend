// ^--------------------Imports
import { Router } from "express";
import productControllers from "../controllers/product.controller.js";
import productValidation from "../validation/product.validation.js";
import validateRequestBody from "../middlewares/schemaValidation.middleware.js";
import systemRoles from "../utils/systemRoles.js";
import authenticate from "../middlewares/authentication.middleware.js";
import reviewRouter from "./review.routes.js";

const productRouter = new Router();

//^------------------------GET all products & POST new product------------------------
productRouter
  .route("/")
  .get(productControllers.getAllProducts)
  .post(
    authenticate([systemRoles.admin]),
    validateRequestBody(productValidation.addProductValidation),
    productControllers.addNewProduct
  );

//^-------------------------------Search & filter Product--------------------------------
productRouter.get("/search", productControllers.searchProduct);
productRouter.get("/filter", productControllers.filterProducts);

//^-------------------------------Least Ordered Products--------------------------------
productRouter.get(
  "/least-ordered-products",
  productControllers.getLeastOrderedProduct
);

//^-------------------------------Get Best Selling Products--------------------------------
productRouter.get(
  "/best-selling-products",
  productControllers.getBestSellingProducts
);

//^--------------------------GET Products By Category---------------------------
productRouter.get(
  "/category/:categoryName",
  productControllers.getProductsByCategory
);

//^--------------------------GET Products By Label---------------------------
productRouter.get("/label/:label", productControllers.getProductsByLabel);

//^--------------------------GET, UPDATE and DELETE product by ID---------------------------
productRouter
  .route("/:id")
  .get(productControllers.getProductById)
  .delete(authenticate([systemRoles.admin]), productControllers.deleteProduct)
  .put(
    authenticate([systemRoles.admin]),
    validateRequestBody(productValidation.updateProductValidation),
    productControllers.updateProduct
  );

//^-------------------------------Get Product Rreviews--------------------------------
productRouter.use("/:id/reviews", reviewRouter);
export default productRouter;
