import { body, param } from "express-validator";

export const createCommentValidator = [
  body("content").notEmpty().withMessage("Comment is required"),
  param("blogId").notEmpty().withMessage("Blog ID is required"),
];

export const getCommentsValidator = [
  param("blogId").notEmpty().withMessage("Blog ID is required"),
];

export const deleteCommentValidator = [
  param("commentId").notEmpty().withMessage("Comment ID is required"),
];
