import type { Request, Response } from "express";
import {
  createBlogService,
  getAllBlogsService,
  getBlogByIdService,
  updateBlogService,
  deleteBlogService,
  searchBlogService,
} from "../services/blog.service";
import { successResponse } from "../utils/response";
import asyncHandler from "express-async-handler";

// create a new blog
export const createBlogController = asyncHandler(
  async (req: Request, res: Response) => {
    const { title, content, category } = req.body;
    const userId = req.user.id;
    const blog = await createBlogService({
      title,
      content,
      category,
      authorId: userId,
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
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 12;
    const skip = (page - 1) * limit;

    const { blogs, metaData } = await getAllBlogsService({
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

// get a single blog by id
export const getBlogByIdController = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const blog = await getBlogByIdService(id as string);
    successResponse({
      res,
      data: blog,
      message: "Blog Fetched Successfully",
      statusCode: 200,
    });
  },
);

// update a blog
export const updateBlogController = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const { title, content, category } = req.body;
    const blog = await updateBlogService({
      id,
      title,
      content,
      category,
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
