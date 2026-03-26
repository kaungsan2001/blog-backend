import { body, param } from "express-validator";

export const createCategoryValidator = [
  body("name").notEmpty().withMessage("Name is required"),
];

export const updateCategoryValidator = [
  param("categoryId").notEmpty().withMessage("Category ID is required"),
  body("name").notEmpty().withMessage("Name is required"),
];

export const deleteCategoryValidator = [
  param("categoryId").notEmpty().withMessage("Category ID is required"),
];
