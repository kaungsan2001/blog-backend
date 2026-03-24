import { body, param, query } from "express-validator";

export const getUserByIdValidator = [
  param("userId").isString().withMessage("User ID must be a string"),
];

export const getUserBlogsValidator = [
  param("userId").isString().withMessage("User ID must be a string"),
];

export const getUserListValidator = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a number"),
  query("limit")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Limit must be a number"),
];

export const updateProfileValidator = [
  body("name").isString().withMessage("Name must be a string"),
];

export const searchUserValidator = [
  query("q").isString().withMessage("Query must be a string"),
];
