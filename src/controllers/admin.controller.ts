import type { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { successResponse } from "../utils/response";
import {
  adminGetAllUsersService,
  getAllAdminsService,
  makeAdminService,
  makeUserService,
  deleteUserService,
  getDashboardStatsService,
} from "../services/user.service";
import {
  adminGetAllBlogsService,
  adminDeleteBlogService,
} from "../services/blog.service";
import {
  createCategory,
  updateCategory,
  deleteCategory,
} from "../services/category.service";

// dashboard stats
export const getDashboardStatsController = asyncHandler(
  async (req: Request, res: Response) => {
    const stats = await getDashboardStatsService();
    successResponse({
      res,
      data: stats,
      message: "Dashboard stats fetched successfully",
      statusCode: 200,
    });
  },
);

// get all users (admin)
export const adminGetAllUsersController = asyncHandler(
  async (req: Request, res: Response) => {
    const searchQuery = req.query.search as string;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;
    const skip = (page - 1) * limit;
    const { users, metaData } = await adminGetAllUsersService({
      page,
      limit,
      skip,
      searchQuery,
    });
    successResponse({
      res,
      data: users,
      meta: metaData,
      message: "Users fetched successfully",
      statusCode: 200,
    });
  },
);

// delete user (admin)
export const adminDeleteUserController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.params.userId as string;
    const authUserId = req.user.id;
    const user = await deleteUserService(userId, authUserId);
    successResponse({
      res,
      data: user,
      message: "User deleted successfully",
      statusCode: 200,
    });
  },
);

// get all blogs (admin)
export const adminGetAllBlogsController = asyncHandler(
  async (req: Request, res: Response) => {
    const searchQuery = req.query.search as string;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;
    const skip = (page - 1) * limit;
    const { blogs, metaData } = await adminGetAllBlogsService({
      page,
      limit,
      skip,
      searchQuery,
    });
    successResponse({
      res,
      data: blogs,
      meta: metaData,
      message: "Blogs fetched successfully",
      statusCode: 200,
    });
  },
);

// delete blog (admin)
export const adminDeleteBlogController = asyncHandler(
  async (req: Request, res: Response) => {
    const blogId = req.params.blogId as string;
    const blog = await adminDeleteBlogService(blogId);
    successResponse({
      res,
      data: blog,
      message: "Blog deleted successfully",
      statusCode: 200,
    });
  },
);

// get all admins
export const adminGetAllAdminsController = asyncHandler(
  async (req: Request, res: Response) => {
    const searchQuery = req.query.search as string;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;
    const skip = (page - 1) * limit;
    const { admins, metaData } = await getAllAdminsService({
      page,
      limit,
      skip,
      searchQuery,
    });
    successResponse({
      res,
      data: admins,
      meta: metaData,
      message: "Admins fetched successfully",
      statusCode: 200,
    });
  },
);

// promote user to admin (super_admin only)
export const makeAdminController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.params.userId as string;
    const authUserId = req.user.id;
    const user = await makeAdminService(userId, authUserId);
    successResponse({
      res,
      data: user,
      message: "User promoted to admin successfully",
      statusCode: 200,
    });
  },
);

// demote admin to user (super_admin only)
export const makeUserController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.params.userId as string;
    const authUserId = req.user.id;
    const user = await makeUserService(userId, authUserId);
    successResponse({
      res,
      data: user,
      message: "Admin demoted to user successfully",
      statusCode: 200,
    });
  },
);

// create category (admin)
export const adminCreateCategoryController = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, description } = req.body;
    const category = await createCategory(name, description);
    successResponse({
      res,
      data: category,
      message: "Category created successfully",
      statusCode: 201,
    });
  },
);

// update category (admin)
export const adminUpdateCategoryController = asyncHandler(
  async (req: Request, res: Response) => {
    const categoryId = req.params.categoryId as string;
    const { name, description } = req.body;
    const category = await updateCategory(categoryId, name, description);
    successResponse({
      res,
      data: category,
      message: "Category updated successfully",
      statusCode: 200,
    });
  },
);

// delete category (admin)
export const adminDeleteCategoryController = asyncHandler(
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
