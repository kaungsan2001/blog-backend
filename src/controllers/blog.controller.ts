import type { Request, Response } from "express";
import {
  createBlogService,
  getAllBlogsService,
  getBlogByIdService,
  updateBlogService,
  deleteBlogService,
  searchBlogService,
  saveBlogService,
  getSavedBlogsService,
  unsaveBlogService,
  getUserBlogsService,
} from "../services/blog.service";
import { successResponse } from "../utils/response";
import asyncHandler from "express-async-handler";

// create a new blog
export const createBlogController = asyncHandler(
  async (req: Request, res: Response) => {
    const imageBuffer = req.file?.buffer;
    const { title, content, categoryId, isPublished } = req.body;
    const userId = req.user.id;
    const blog = await createBlogService({
      imageBuffer,
      title: title.toString().trim(),
      content: content.toString().trim(),
      categoryId: categoryId.toString().trim(),
      authorId: userId,
      isPublished: isPublished === "true" ? true : false,
    });

    successResponse({
      res,
      data: blog,
      message: "Blog Created Successfully",
      statusCode: 201,
    });
  },
);

// get all blogs with pagination
export const getAllBlogsController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user.id;
    const categoryId = req.query.category as string;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 12;
    const skip = (page - 1) * limit;

    const { blogs, metaData } = await getAllBlogsService({
      page,
      limit,
      skip,
      userId,
      categoryId,
    });
    successResponse({
      res,
      data: blogs,
      message: "Blogs Fetched Successfully",
      statusCode: 200,
      meta: metaData,
    });
  },
);

// get a single blog by id
export const getBlogByIdController = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const blog = await getBlogByIdService(id as string, req.user.id);
    successResponse({
      res,
      data: blog,
      message: "Blog Fetched Successfully",
      statusCode: 200,
    });
  },
);

// get user's blogs with pagination
export const getUserBlogsController = asyncHandler(
  async (req: Request, res: Response) => {
    const isPublished = req.query.isPublished as string;
    const isPublishedBoolean =
      isPublished.toLowerCase() === "true" ? true : false;
    const authUserId = req.user.id;
    const authorId = req.params.userId as string;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;
    const skip = (page - 1) * limit;
    const { blogs, metaData } = await getUserBlogsService({
      authorId,
      authUserId,
      page,
      limit,
      skip,
      isPublished: isPublishedBoolean,
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

// update a blog
export const updateBlogController = asyncHandler(
  async (req: Request, res: Response) => {
    const imageBuffer = req.file?.buffer;
    const id = req.params.id as string;
    const { title, content, categoryId, isPublished } = req.body;
    const blog = await updateBlogService({
      id,
      imageBuffer,
      title: title.toString().trim(),
      content: content.toString().trim(),
      categoryId: categoryId.toString().trim(),
      isPublished: isPublished === "true" ? true : false,
      authorId: req.user.id,
    });
    successResponse({
      res,
      data: blog,
      message: "Blog Updated Successfully",
      statusCode: 200,
    });
  },
);

// delete a blog
export const deleteBlogController = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const blog = await deleteBlogService(id, req.user.id);

    successResponse({
      res,
      data: blog,
      message: "Blog Deleted Successfully",
      statusCode: 200,
    });
  },
);

// search blogs with pagination
export const searchBlogController = asyncHandler(
  async (req: Request, res: Response) => {
    const q = req.query.q as string;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 12;
    const skip = (page - 1) * limit;
    const { blogs, metaData } = await searchBlogService({
      q,
      page,
      limit,
      skip,
    });
    successResponse({
      res,
      data: blogs,
      message: "Blogs Fetched Successfully",
      statusCode: 200,
      meta: metaData,
    });
  },
);

// save blog
export const saveBlogController = asyncHandler(
  async (req: Request, res: Response) => {
    const { blogId } = req.params;
    const blog = await saveBlogService(blogId as string, req.user.id);
    successResponse({
      res,
      data: blog,
      message: "Blog Saved Successfully",
      statusCode: 200,
    });
  },
);

// unsave blog
export const unsaveBlogController = asyncHandler(
  async (req: Request, res: Response) => {
    const { blogId } = req.params;
    const blog = await unsaveBlogService(blogId as string, req.user.id);
    successResponse({
      res,
      data: blog,
      message: "Blog Unsaved Successfully",
      statusCode: 200,
    });
  },
);

// get all saved blogs
export const getSavedBlogsController = asyncHandler(
  async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 12;
    const skip = (page - 1) * limit;
    const { blogs, metaData } = await getSavedBlogsService({
      page,
      limit,
      skip,
      userId: req.user.id,
    });
    successResponse({
      res,
      data: blogs,
      message: "Saved Blogs Fetched Successfully",
      statusCode: 200,
      meta: metaData,
    });
  },
);
