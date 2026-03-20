import { Router } from "express";
import authMiddleware from "../../middlewares/auth.middleware";
import {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
} from "../../controllers/blog.controller";
import { validatedMiddleware } from "../../middlewares/validated.middleware";
import {
  createBlogValidator,
  updateBlogValidator,
  deleteBlogValidator,
  getBlogByIdValidator,
  getAllBlogsValidator,
} from "../../validators/blog.validator";

const router = Router();

router.post(
  "/create",
  authMiddleware,
  createBlogValidator,
  validatedMiddleware,
  createBlog,
);
router.get("/", getAllBlogsValidator, validatedMiddleware, getAllBlogs);
router.get("/:id", getBlogByIdValidator, validatedMiddleware, getBlogById);
router.put(
  "/:id",
  authMiddleware,
  updateBlogValidator,
  validatedMiddleware,
  updateBlog,
);
router.delete(
  "/:id",
  authMiddleware,
  deleteBlogValidator,
  validatedMiddleware,
  deleteBlog,
);

export default router;
