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
  getAllBlogsValidator,
  validatedMiddleware,
  getAllBlogsController,
);

// get a single blog by id route
router.get(
  "/details/:id",
  getBlogByIdValidator,
  validatedMiddleware,
  getBlogByIdController,
);

// search blogs route
router.get(
  "/search",
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

// save or unsave blog route
router.post(
  "/save/:blogId",
  authMiddleware,
  saveBlogValidator,
  validatedMiddleware,
  saveBlogController,
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
