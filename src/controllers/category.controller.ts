import { getAllCategories } from "../services/category.service";
import asyncHandler from "express-async-handler";
import type { Request, Response } from "express";
import { successResponse } from "../utils/response";

export const getAllCategoriesController = asyncHandler(
  async (req: Request, res: Response) => {
    const searchQuery = req.query.search as string;
    const categories = await getAllCategories({ searchQuery });
    successResponse({
      res,
      data: categories,
      message: "Categories fetched successfully",
      statusCode: 200,
    });
  },
);
