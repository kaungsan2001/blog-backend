import { Router } from "express";
import {
  createCommentController,
  getCommentsController,
  deleteCommentController,
} from "../../controllers/comment.controller";
import {
  createCommentValidator,
  getCommentsValidator,
  deleteCommentValidator,
} from "../../validators/comment.validator";
import { validatedMiddleware } from "../../middlewares/validated.middleware";
import authMiddleware from "../../middlewares/auth.middleware";

const router = Router({ mergeParams: true });

router.post(
  "/",
  authMiddleware,
  createCommentValidator,
  validatedMiddleware,
  createCommentController,
);

router.get(
  "/",
  getCommentsValidator,
  validatedMiddleware,
  getCommentsController,
);

router.delete(
  "/:commentId",
  authMiddleware,
  deleteCommentValidator,
  validatedMiddleware,
  deleteCommentController,
);

export default router;
