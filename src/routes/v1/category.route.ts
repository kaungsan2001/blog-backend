import { Router } from "express";
import {
  getAllCategoriesController,
  createCategoryController,
  updateCategoryController,
  deleteCategoryController,
} from "../../controllers/category.controller";
import { validatedMiddleware } from "../../middlewares/validated.middleware";
import {
  createCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} from "../../validators/category.validator";
import adminMiddleware from "../../middlewares/admin.middleware";

const router = Router();

router.get("/", getAllCategoriesController);
router.post(
  "/",
  adminMiddleware,
  createCategoryValidator,
  validatedMiddleware,
  createCategoryController,
);
router.put(
  "/:categoryId",
  adminMiddleware,
  updateCategoryValidator,
  validatedMiddleware,
  updateCategoryController,
);
router.delete(
  "/:categoryId",
  adminMiddleware,
  deleteCategoryValidator,
  validatedMiddleware,
  deleteCategoryController,
);

export default router;
