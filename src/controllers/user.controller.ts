import type { Request, Response } from "express";
import {
  getUserByIdService,
  getUserListService,
  updateProfileService,
  searchUserService,
  getAllFollowersService,
  getAllFollowingService,
  followUserService,
  unfollowUserService,
} from "../services/user.service";
import asyncHandler from "express-async-handler";
import { successResponse } from "../utils/response";

// get user by id
export const getUserByIdController = asyncHandler(
  async (req: Request, res: Response) => {
    const target_userId = req.params.userId as string;
    const userId = req.user.id as string;

    const user = await getUserByIdService({ target_userId, userId });
    successResponse({
      res,
      data: user,
      message: "User fetched successfully",
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
    const { name, bio, address } = req.body;
    const updatedUser = await updateProfileService({
      id: userId,
      name,
      bio,
      address,
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

// follow user
export const followUserController = asyncHandler(
  async (req: Request, res: Response) => {
    const followerId = req.user.id as string;
    const followingId = req.params.userId as string;
    const result = await followUserService({
      followerId,
      followingId,
    });
    successResponse({
      res,
      data: result,
      message: "User followed successfully",
      statusCode: 200,
    });
  },
);

// unfollow user
export const unfollowUserController = asyncHandler(
  async (req: Request, res: Response) => {
    const followerId = req.user.id as string;
    const followingId = req.params.userId as string;
    const result = await unfollowUserService({
      followerId,
      followingId,
    });
    successResponse({
      res,
      data: result,
      message: "User unfollowed successfully",
      statusCode: 200,
    });
  },
);

// get all followers
export const getAllFollowersController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user.id as string;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;
    const skip = (page - 1) * limit;
    const { users, metaData } = await getAllFollowersService({
      userId,
      page,
      limit,
      skip,
    });
    successResponse({
      res,
      data: users,
      meta: metaData,
      message: "Followers fetched successfully",
      statusCode: 200,
    });
  },
);

// get all following
export const getAllFollowingController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user.id as string;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;
    const skip = (page - 1) * limit;
    const { users, metaData } = await getAllFollowingService({
      userId,
      page,
      limit,
      skip,
    });
    successResponse({
      res,
      data: users,
      meta: metaData,
      message: "Following fetched successfully",
      statusCode: 200,
    });
  },
);
