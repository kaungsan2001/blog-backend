import type { Request, Response } from "express";
import {
  createBlogService,
  getAllBlogsService,
  getBlogByIdService,
  updateBlogService,
  deleteBlogService,
} from "../services/blog.service";
import { successResponse } from "../utils/response";
import asyncHandler from "express-async-handler";

export const createBlog = asyncHandler(async (req: Request, res: Response) => {
  const { title, content, category, image } = req.body;
  const userId = req.user.id;
  const blog = await createBlogService({
    title,
    content,
    category,
    image,
    userId,
  });
  const response = {
    res,
    data: blog,
    message: "Blog Created Successfully",
    statusCode: 201,
  };
  successResponse(response);
});

export const getAllBlogs = asyncHandler(async (req: Request, res: Response) => {
  const { query } = req.query as { query: string };
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 12;
  const skip = (page - 1) * limit;

  const { blogs, metaData } = await getAllBlogsService({
    query,
    page,
    limit,
    skip,
  });
  const response = {
    res,
    data: blogs,
    message: "Blogs Fetched Successfully",
    statusCode: 200,
    meta: metaData,
  };
  successResponse(response);
});

export const getBlogById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const blog = await getBlogByIdService(id as string);
  const response = {
    res,
    data: blog,
    message: "Blog Fetched Successfully",
    statusCode: 200,
  };
  successResponse(response);
});

export const updateBlog = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const { title, content, category, image } = req.body;
  const blog = await updateBlogService({
    id,
    title,
    content,
    category,
    image,
    userId: req.user.id,
  });
  const response = {
    res,
    data: blog,
    message: "Blog Updated Successfully",
    statusCode: 200,
  };
  successResponse(response);
});

export const deleteBlog = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const blog = await deleteBlogService(id, req.user.id);
  const response = {
    res,
    data: blog,
    message: "Blog Deleted Successfully",
    statusCode: 200,
  };
  successResponse(response);
});
