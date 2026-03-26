import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../services/category.service";
import asyncHandler from "express-async-handler";
import type { Request, Response } from "express";
import { successResponse } from "../utils/response";

export const getAllCategoriesController = asyncHandler(
  async (req: Request, res: Response) => {
    const categories = await getAllCategories();
    successResponse({
      res,
      data: categories,
      message: "Categories fetched successfully",
      statusCode: 200,
    });
  },
);

export const createCategoryController = asyncHandler(
  async (req: Request, res: Response) => {
    const { name } = req.body;
    const category = await createCategory(name);
    successResponse({
      res,
      data: category,
      message: "Category created successfully",
      statusCode: 201,
    });
  },
);

export const updateCategoryController = asyncHandler(
  async (req: Request, res: Response) => {
    const categoryId = req.params.categoryId as string;
    const { name } = req.body;
    const category = await updateCategory(categoryId, name);
    successResponse({
      res,
      data: category,
      message: "Category updated successfully",
      statusCode: 200,
    });
  },
);

export const deleteCategoryController = asyncHandler(
  async (req: Request, res: Response) => {
    const categoryId = req.params.categoryId as string;
    const category = await deleteCategory(categoryId);
    successResponse({
      res,
      data: category,
      message: "Category deleted successfully",
      statusCode: 200,
    });
  },
);
