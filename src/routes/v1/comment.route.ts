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

// get all comments route by blog id
router.get(
  "/",
  getCommentsValidator,
  validatedMiddleware,
  getCommentsController,
);

// create a new comment route
router.post(
  "/",
  authMiddleware,
  createCommentValidator,
  validatedMiddleware,
  createCommentController,
);

// delete a comment route by comment id
router.delete(
  "/:commentId",
  authMiddleware,
  deleteCommentValidator,
  validatedMiddleware,
  deleteCommentController,
);

export default router;
