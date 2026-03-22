import type { Request, Response } from "express";
import {
  getUserByIdService,
  getUserBlogsService,
  getUserListService,
  updateProfileService,
  searchUserService,
} from "../services/user.service";
import asyncHandler from "express-async-handler";
import { successResponse } from "../utils/response";

// get user by id
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

// get user's blogs with pagination
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

// get all users with pagination
export const getUserListController = asyncHandler(
  async (req: Request, res: Response) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;
    const skip = (page - 1) * limit;
    const { users, metaData } = await getUserListService({
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

// update profile
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

// search user
export const searchUserController = asyncHandler(
  async (req: Request, res: Response) => {
    const q = req.query.q as string;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;
    const skip = (page - 1) * limit;
    const { users, metaData } = await searchUserService({
      q,
      page,
      limit,
      skip,
    });
    successResponse({
      res,
      data: users,
      meta: metaData,
      message: "User search successfully",
      statusCode: 200,
    });
  },
);
