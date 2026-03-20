import createHttpError from "http-errors";
import { prisma } from "../db";

export const getUserByIdService = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          blogs: true,
        },
      },
    },
  });

  if (!user) {
    throw createHttpError.NotFound("User Not Found");
  }

  return user;
};

export const getUserBlogsService = async (id: string) => {
  const blogs = await prisma.blog.findMany({
    where: {
      authorId: id,
    },
  });

  return blogs;
};

export const getUserListService = async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          blogs: true,
        },
      },
    },
  });

  return users;
};
