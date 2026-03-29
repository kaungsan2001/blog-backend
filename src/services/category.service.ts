import { prisma } from "../db";
import createHttpError from "http-errors";
import redis_client from "../lib/redis";
import { deleteCache } from "../utils/deleteCache";

export const getAllCategories = async ({
  searchQuery,
}: {
  searchQuery?: string;
}) => {
  const cacheKey = "categories:" + searchQuery;
  const cachedCategories = await redis_client.get(cacheKey);
  if (cachedCategories) {
    return JSON.parse(cachedCategories);
  }
  const categories = await prisma.category.findMany({
    where: searchQuery
      ? {
          name: {
            contains: searchQuery,
            mode: "insensitive",
          },
        }
      : {},
    include: {
      _count: {
        select: {
          blogs: {
            where: {
              isPublished: true,
            },
          },
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

export const createCategory = async (name: string, description: string) => {
  const category = await prisma.category.findUnique({ where: { name } });
  if (category) {
    throw createHttpError.Conflict("Category already exists");
  }
  deleteCache("categories:");
  const categories = await prisma.category.create({
    data: { name, description },
  });

  return categories;
};

export const updateCategory = async (
  id: string,
  name: string,
  description: string,
) => {
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) {
    throw createHttpError.NotFound("Category not found");
  }
  deleteCache("categories:");
  const updatedCategory = await prisma.category.update({
    where: { id },
    data: { name, description },
  });

  return updatedCategory;
};

export const deleteCategory = async (id: string) => {
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) {
    throw createHttpError.NotFound("Category not found");
  }
  deleteCache("categories:");
  const deletedCategory = await prisma.category.delete({ where: { id } });

  return deletedCategory;
};
