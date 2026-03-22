import { Router } from "express";
import authMiddleware from "../../middlewares/auth.middleware";
import {
  createBlogController,
  getAllBlogsController,
  getBlogByIdController,
  updateBlogController,
  deleteBlogController,
  searchBlogController,
} from "../../controllers/blog.controller";
import { validatedMiddleware } from "../../middlewares/validated.middleware";
import {
  createBlogValidator,
  updateBlogValidator,
  deleteBlogValidator,
  getBlogByIdValidator,
  getAllBlogsValidator,
  searchBlogValidator,
} from "../../validators/blog.validator";

const router = Router();

// create a new blog route
router.post(
  "/create",
  authMiddleware,
  createBlogValidator,
  validatedMiddleware,
  createBlogController,
);

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

// search blogs route
router.get(
  "/search",
  searchBlogValidator,
  validatedMiddleware,
  searchBlogController,
);
export default router;
