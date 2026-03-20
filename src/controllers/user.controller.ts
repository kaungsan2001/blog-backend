import type { Request, Response } from "express";
import {
  getUserByIdService,
  getUserBlogsService,
  getUserListService,
} from "../services/user.service";
import asyncHandler from "express-async-handler";
import { successResponse } from "../utils/response";

export const getUserByIdController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.params.id as string;

    const user = await getUserByIdService(userId);
    successResponse({
      res,
      data: user,
      message: "User fetched successfully",
      statusCode: 200,
    });
  },
);

export const getUserBlogsController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.params.id as string;
    const blogs = await getUserBlogsService(userId);
    successResponse({
      res,
      data: blogs,
      message: "User blogs fetched successfully",
      statusCode: 200,
    });
  },
);

export const getUserListController = asyncHandler(
  async (req: Request, res: Response) => {
    const users = await getUserListService();
    successResponse({
      res,
      data: users,
      message: "User list fetched successfully",
      statusCode: 200,
    });
  },
);
