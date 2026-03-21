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

export const getUserBlogsService = async ({
  id,
  page,
  limit,
  skip,
}: {
  id: string;
  page: number;
  limit: number;
  skip: number;
}) => {
  const blogs = await prisma.blog.findMany({
    skip,
    take: limit,
    where: {
      authorId: id,
    },
  });

  const totalBlogs = await prisma.blog.count({
    where: {
      authorId: id,
    },
  });

  const totalPages = Math.ceil(totalBlogs / limit);
  const metaData = {
    totalBlogs,
    totalPages,
    currentPage: page,
    limit,
  };

  return { blogs, metaData };
};

export const getUserListService = async ({
  query,
  page,
  limit,
  skip,
}: {
  query: string;
  page: number;
  limit: number;
  skip: number;
}) => {
  const users = await prisma.user.findMany({
    skip,
    take: limit,
    where: query
      ? {
          name: {
            contains: query,
            mode: "insensitive",
          },
        }
      : undefined,
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

  const totalUsers = await prisma.user.count({
    where: query
      ? {
          name: {
            contains: query,
            mode: "insensitive",
          },
        }
      : undefined,
  });
  const totalPages = Math.ceil(totalUsers / limit);
  const metaData = {
    totalUsers,
    totalPages,
    currentPage: page,
    limit,
  };

  return { users, metaData };
};

export const updateProfileService = async ({
  id,
  name,
}: {
  id: string;
  name: string;
}) => {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });
  if (!user) {
    throw createHttpError.NotFound("User Not Found");
  }
  const updatedUser = await prisma.user.update({
    where: {
      id,
    },
    data: {
      name,
    },
  });

  return updatedUser;
};
