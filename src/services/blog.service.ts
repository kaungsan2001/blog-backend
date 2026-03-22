import createHttpError from "http-errors";
import { prisma } from "../db";

// create new blog
export const createBlogService = async (data: {
  title: string;
  content: string;
  category: string;
  authorId: string;
}) => {
  const blog = await prisma.blog.create({ data });
  return blog;
};

// get all blogs
export const getAllBlogsService = async ({
  page,
  limit,
  skip,
}: {
  page: number;
  limit: number;
  skip: number;
}) => {
  const blogs = await prisma.blog.findMany({
    skip,
    take: limit,
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

  const totalBlogs = await prisma.blog.count();
  const totalPages = Math.ceil(totalBlogs / limit);
  const metaData = {
    totalBlogs,
    totalPages,
    currentPage: page,
    limit,
  };
  return { blogs, metaData };
};

// get a single blog by id
export const getBlogByIdService = async (id: string) => {
  const blog = await prisma.blog.findUnique({
    where: { id },
    include: {
      author: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });
  return blog;
};

// update a blog
export const updateBlogService = async ({
  id,
  title,
  content,
  category,
  authorId,
}: {
  id: string;
  title: string;
  content: string;
  category: string;
  authorId: string;
}) => {
  const blog = await prisma.blog.findUnique({
    where: {
      id,
    },
  });
  if (!blog) {
    throw createHttpError.NotFound("Blog Not Found.");
  }
  if (blog.authorId !== authorId) {
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
    },
  });
  return updatedBlog;
};

// delete a blog by id
export const deleteBlogService = async (id: string, userId: string) => {
  const blog = await prisma.blog.findUnique({
    where: { id },
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
    where: { id },
  });

  return deletedBlog;
};

//search blog
export const searchBlogService = async ({
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
  const blogs = await prisma.blog.findMany({
    skip,
    take: limit,
    where: {
      OR: [
        {
          title: {
            contains: q,
            mode: "insensitive",
          },
        },
        {
          content: {
            contains: q,
            mode: "insensitive",
          },
        },
        {
          category: {
            contains: q,
          },
        },
      ],
    },
    include: {
      author: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  const totalBlogs = await prisma.blog.count({
    where: {
      OR: [
        {
          title: {
            contains: q,
            mode: "insensitive",
          },
        },
        {
          content: {
            contains: q,
            mode: "insensitive",
          },
        },
        {
          category: {
            contains: q,
          },
        },
      ],
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
