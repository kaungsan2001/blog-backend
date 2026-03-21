import { body, param, query } from "express-validator";

export const getUserByIdValidator = [
  param("id").isString().withMessage("User ID must be a string"),
];

export const getUserBlogsValidator = [
  param("id").isString().withMessage("User ID must be a string"),
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
