import { prisma } from "../db";
import createHttpError from "http-errors";
import redis_client from "../lib/redis";
import { deleteCache } from "../utils/deleteCache";

export const getAllCategories = async () => {
  const cacheKey = "categories";
  const cachedCategories = await redis_client.get(cacheKey);
  if (cachedCategories) {
    return JSON.parse(cachedCategories);
  }
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: {
          blogs: true,
        },
      },
    },
    orderBy: {
      blogs: {
        _count: "desc",
      },
    },
  });
  await redis_client.set(cacheKey, JSON.stringify(categories), {
    EX: 60 * 60 * 24,
  });
  return categories;
};

export const createCategory = async (name: string) => {
  const category = await prisma.category.findUnique({ where: { name } });
  if (category) {
    throw createHttpError.Conflict("Category already exists");
  }
  const categories = await prisma.category.create({ data: { name } });
  deleteCache("categories");
  return categories;
};

export const updateCategory = async (id: string, name: string) => {
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) {
    throw createHttpError.NotFound("Category not found");
  }
  const updatedCategory = await prisma.category.update({
    where: { id },
    data: { name },
  });
  deleteCache("categories");
  return updatedCategory;
};

export const deleteCategory = async (id: string) => {
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) {
    throw createHttpError.NotFound("Category not found");
  }
  const deletedCategory = await prisma.category.delete({ where: { id } });
  deleteCache("categories");
  return deletedCategory;
};
