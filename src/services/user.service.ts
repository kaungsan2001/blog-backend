import createHttpError from "http-errors";
import { prisma } from "../db";

// get user by id
export const getUserByIdService = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
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

// get user's blogs
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
    where: { authorId: id },
    include: {
      author: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  const totalBlogs = await prisma.blog.count({
    where: { authorId: id },
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

// get all users
export const getUserListService = async ({
  page,
  limit,
  skip,
}: {
  page: number;
  limit: number;
  skip: number;
}) => {
  const users = await prisma.user.findMany({
    skip,
    take: limit,
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

  const totalUsers = await prisma.user.count();
  const totalPages = Math.ceil(totalUsers / limit);
  const metaData = {
    totalUsers,
    totalPages,
    currentPage: page,
    limit,
  };

  return { users, metaData };
};

// update user profile
export const updateProfileService = async ({
  id,
  name,
}: {
  id: string;
  name: string;
}) => {
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    throw createHttpError.NotFound("User Not Found");
  }

  const updatedUser = await prisma.user.update({
    where: { id },
    data: { name },
  });

  return updatedUser;
};

// search user
export const searchUserService = async ({
  q,
  page,
  limit,
  skip,
}: {
  q: string;
  page: number;
  limit: number;
  skip: number;
}) => {
  const users = await prisma.user.findMany({
    skip,
    take: limit,
    where: {
      name: {
        contains: q,
        mode: "insensitive",
      },
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

  const totalUsers = await prisma.user.count({
    where: {
      name: {
        contains: q,
        mode: "insensitive",
      },
    },
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
