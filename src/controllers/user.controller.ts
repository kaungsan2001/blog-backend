import type { Request, Response } from "express";
import {
  getUserByIdService,
  getUserBlogsService,
  getUserListService,
  updateProfileService,
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
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;
    const skip = (page - 1) * limit;
    const { blogs, metaData } = await getUserBlogsService({
      id: userId,
      page,
      limit,
      skip,
    });
    successResponse({
      res,
      data: blogs,
      meta: metaData,
      message: "User blogs fetched successfully",
      statusCode: 200,
    });
  },
);

export const getUserListController = asyncHandler(
  async (req: Request, res: Response) => {
    const { query } = req.query as { query: string };
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;
    const skip = (page - 1) * limit;
    const { users, metaData } = await getUserListService({
      query,
      page,
      limit,
      skip,
    });
    successResponse({
      res,
      data: users,
      meta: metaData,
      message: "User list fetched successfully",
      statusCode: 200,
    });
  },
);

export const updateProfileController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user.id as string;
    const { name } = req.body;
    const updatedUser = await updateProfileService({
      id: userId,
      name,
    });
    successResponse({
      res,
      data: updatedUser,
      message: "Profile updated successfully",
      statusCode: 200,
    });
  },
);
