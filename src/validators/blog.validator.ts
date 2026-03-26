import { body, param, query } from "express-validator";

export const createBlogValidator = [
  body("title").notEmpty().withMessage("Title is required"),
  body("content").notEmpty().withMessage("Content is required"),
  body("categoryId").notEmpty().withMessage("Category Id is required"),
  body("image").optional(),
];

export const updateBlogValidator = [
  param("id").notEmpty().withMessage("Id is required"),
  body("title").notEmpty().withMessage("Title is required"),
  body("content").notEmpty().withMessage("Content is required"),
  body("categoryId").notEmpty().withMessage("Category Id is required"),
  body("image").optional(),
];

export const deleteBlogValidator = [
  param("id").notEmpty().withMessage("Id is required"),
];

export const getBlogByIdValidator = [
  param("id").notEmpty().withMessage("Id is required"),
];

export const getUserBlogsValidator = [
  param("userId").isString().withMessage("User ID must be a string"),
];

export const getAllBlogsValidator = [
  query("page").optional().notEmpty().withMessage("Page is required"),
  query("limit").optional().notEmpty().withMessage("Limit is required"),
];

export const searchBlogValidator = [
  query("q").notEmpty().isString().withMessage("Query is required"),
];

export const saveBlogValidator = [
  param("blogId").notEmpty().withMessage("Blog Id is required"),
];

export const followUserValidator = [
  param("userId").notEmpty().withMessage("User Id is required"),
];
