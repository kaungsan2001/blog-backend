import createHttpError from "http-errors";
import { prisma } from "../db";

export const createBlogService = async ({
  title,
  content,
  category,
  image,
  userId,
}: {
  title: string;
  content: string;
  category: string;
  image: string;
  userId: string;
}) => {
  const blog = await prisma.blog.create({
    data: {
      title,
      content,
      category,
      image,
      authorId: userId,
    },
  });
  return blog;
};

export const getAllBlogsService = async ({
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
  const blogs = await prisma.blog.findMany({
    skip,
    take: limit,
    where: query
      ? {
          OR: [
            {
              title: {
                contains: query,
                mode: "insensitive",
              },
            },
            {
              category: {
                contains: query,
              },
            },
          ],
        }
      : {},
    include: {
      author: {
        select: {
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const totalBlogs = await prisma.blog.count({
    where: query
      ? {
          OR: [
            {
              title: {
                contains: query,
                mode: "insensitive",
              },
            },
            {
              category: {
                contains: query,
              },
            },
          ],
        }
      : {},
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

export const getBlogByIdService = async (id: string) => {
  const blog = await prisma.blog.findUnique({
    where: {
      id,
    },
    include: {
      author: {
        select: {
          name: true,
          email: true,
        },
      },
      comments: {
        include: {
          author: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      },
    },
  });
  return blog;
};

export const updateBlogService = async ({
  id,
  title,
  content,
  category,
  image,
  userId,
}: {
  id: string;
  title?: string;
  content?: string;
  category?: string;
  image?: string;
  userId: string;
}) => {
  const blog = await prisma.blog.findUnique({
    where: {
      id,
    },
  });
  if (!blog) {
    throw createHttpError.NotFound("Blog Not Found.");
  }
  if (blog.authorId !== userId) {
    throw createHttpError.Unauthorized(
      "You are not authorized to update this blog",
    );
  }
  const updatedBlog = await prisma.blog.update({
    where: {
      id,
    },
    data: {
      title,
      content,
      category,
      image,
    },
  });
  return updatedBlog;
};

export const deleteBlogService = async (id: string, userId: string) => {
  const blog = await prisma.blog.findUnique({
    where: {
      id,
    },
  });
  if (!blog) {
    throw createHttpError.NotFound("Blog Not Found.");
  }
  if (blog.authorId !== userId) {
    throw createHttpError.Unauthorized(
      "You are not authorized to delete this blog",
    );
  }
  const deletedBlog = await prisma.blog.delete({
    where: {
      id,
    },
  });
  return deletedBlog;
};
