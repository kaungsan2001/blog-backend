import type { Request, Response } from "express";
import {
  createCommentService,
  getCommentsService,
  deleteCommentService,
} from "../services/comment.service";
import { successResponse } from "../utils/response";
import asyncHandler from "express-async-handler";

// create a comment
export const createCommentController = asyncHandler(
  async (req: Request, res: Response) => {
    const { content } = req.body;
    const authorId = req.user.id;
    const blogId = req.params.blogId as string;
    const newComment = await createCommentService({
      content,
      blogId,
      authorId,
    });
    successResponse({
      res,
      data: newComment,
      message: "Comment created successfully",
      statusCode: 201,
    });
  },
);

// get all comments by blog id
export const getCommentsController = asyncHandler(
  async (req: Request, res: Response) => {
    const blogId = req.params.blogId as string;

    const comments = await getCommentsService(blogId);
    successResponse({
      res,
      data: comments,
      message: "Comments fetched successfully",
      statusCode: 200,
    });
  },
);

// delete a comment by id
export const deleteCommentController = asyncHandler(
  async (req: Request, res: Response) => {
    const commentId = req.params.commentId as string;
    const authorId = req.user.id;
    const deletedComment = await deleteCommentService({
      commentId,
      authorId,
    });
    successResponse({
      res,
      data: deletedComment,
      message: "Comment deleted successfully",
      statusCode: 200,
    });
  },
);
