import { prisma } from "../db";
import createHttpError from "http-errors";

export const getAllCategories = async () => {
  return await prisma.category.findMany({
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
};

export const createCategory = async (name: string) => {
  const category = await prisma.category.findUnique({ where: { name } });
  if (category) {
    throw createHttpError.Conflict("Category already exists");
  }
  return await prisma.category.create({ data: { name } });
};

export const updateCategory = async (id: string, name: string) => {
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) {
    throw createHttpError.NotFound("Category not found");
  }
  return await prisma.category.update({ where: { id }, data: { name } });
};

export const deleteCategory = async (id: string) => {
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) {
    throw createHttpError.NotFound("Category not found");
  }
  return await prisma.category.delete({ where: { id } });
};
