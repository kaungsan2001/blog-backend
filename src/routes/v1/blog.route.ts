import { Router } from "express";
import authMiddleware from "../../middlewares/auth.middleware";
import {
  createBlogController,
  getAllBlogsController,
  getBlogByIdController,
  updateBlogController,
  deleteBlogController,
  searchBlogController,
  getSavedBlogsController,
  saveBlogController,
  unsaveBlogController,
} from "../../controllers/blog.controller";
import { validatedMiddleware } from "../../middlewares/validated.middleware";
import {
  createBlogValidator,
  updateBlogValidator,
  deleteBlogValidator,
  getBlogByIdValidator,
  getAllBlogsValidator,
  searchBlogValidator,
  saveBlogValidator,
} from "../../validators/blog.validator";

const router = Router();

// get all blogs route
router.get(
  "/",
  authMiddleware,
  getAllBlogsValidator,
  validatedMiddleware,
  getAllBlogsController,
);

// get a single blog by id route
router.get(
  "/details/:id",
  authMiddleware,
  getBlogByIdValidator,
  validatedMiddleware,
  getBlogByIdController,
);

// search blogs route
router.get(
  "/search",
  authMiddleware,
  searchBlogValidator,
  validatedMiddleware,
  searchBlogController,
);

// get all saved blogs route
router.get(
  "/saved",
  authMiddleware,
  validatedMiddleware,
  getSavedBlogsController,
);

// create a new blog route
router.post(
  "/create",
  authMiddleware,
  createBlogValidator,
  validatedMiddleware,
  createBlogController,
);

// save blog route
router.post(
  "/save/:blogId",
  authMiddleware,
  saveBlogValidator,
  validatedMiddleware,
  saveBlogController,
);

// unsave blog route
router.delete(
  "/unsave/:blogId",
  authMiddleware,
  saveBlogValidator,
  validatedMiddleware,
  unsaveBlogController,
);

// update a blog route
router.put(
  "/:id",
  authMiddleware,
  updateBlogValidator,
  validatedMiddleware,
  updateBlogController,
);

// delete a blog route
router.delete(
  "/:id",
  authMiddleware,
  deleteBlogValidator,
  validatedMiddleware,
  deleteBlogController,
);

export default router;
