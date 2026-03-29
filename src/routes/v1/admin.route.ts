import { Router } from "express";
import adminMiddleware from "../../middlewares/admin.middleware";
import superAdminMiddleware from "../../middlewares/superadmin.middleware";
import { validatedMiddleware } from "../../middlewares/validated.middleware";
import {
  createCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} from "../../validators/category.validator";
import {
  getDashboardStatsController,
  adminGetAllUsersController,
  adminDeleteUserController,
  adminGetAllBlogsController,
  adminDeleteBlogController,
  adminGetAllAdminsController,
  makeAdminController,
  makeUserController,
  adminCreateCategoryController,
  adminUpdateCategoryController,
  adminDeleteCategoryController,
} from "../../controllers/admin.controller";

const router = Router();

// dashboard stats
router.get("/stats", adminMiddleware, getDashboardStatsController);

// users
router.get("/users", adminMiddleware, adminGetAllUsersController);
router.delete("/users/:userId", adminMiddleware, adminDeleteUserController);

// blogs
router.get("/blogs", adminMiddleware, adminGetAllBlogsController);
router.delete("/blogs/:blogId", adminMiddleware, adminDeleteBlogController);

// admins
router.get("/admins", adminMiddleware, adminGetAllAdminsController);
router.put("/admins/promote/:userId", adminMiddleware, makeAdminController);
router.put("/admins/demote/:userId", superAdminMiddleware, makeUserController);

// categories
router.post(
  "/categories",
  adminMiddleware,
  createCategoryValidator,
  validatedMiddleware,
  adminCreateCategoryController,
);
router.put(
  "/categories/:categoryId",
  adminMiddleware,
  updateCategoryValidator,
  validatedMiddleware,
  adminUpdateCategoryController,
);
router.delete(
  "/categories/:categoryId",
  adminMiddleware,
  deleteCategoryValidator,
  validatedMiddleware,
  adminDeleteCategoryController,
);

export default router;
