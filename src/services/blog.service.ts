import createHttpError from "http-errors";
import { prisma } from "../db";
import redis_client from "../lib/redis";
import { deleteCache } from "../utils/deleteCache";

// create new blog
export const createBlogService = async (data: {
  title: string;
  content: string;
  categoryId: string;
  authorId: string;
}) => {
  const blog = await prisma.blog.create({ data });

  // delete all blogs cache
  deleteCache("blogs:*");

  // delete user's blogs cache
  deleteCache(`user-blogs:${data.authorId}:*`);

  // delete categories cache because the blog count of categories will be changed
  deleteCache("categories");

  return blog;
};

// get all blogs
export const getAllBlogsService = async ({
  page,
  limit,
  skip,
  userId,
  categoryId,
}: {
  page: number;
  limit: number;
  skip: number;
  userId: string;
  categoryId?: string;
}) => {
  const cacheKey = `blogs:${page}:${limit}:${categoryId || ""}`;
  const cachedBlogs = await redis_client.get(cacheKey);

  // check blog cache is exist or not , if exist then return cached blogs
  if (cachedBlogs) {
    return JSON.parse(cachedBlogs);
  }

  const blogsData = await prisma.blog.findMany({
    skip,
    take: limit,
    where: categoryId
      ? {
          categoryId,
        }
      : {},
    include: {
      category: {
        select: {
          id: true,
          name: true,
        },
      },
      author: {
        select: {
          name: true,
          email: true,
        },
      },
      savedBy: {
        where: {
          userId,
        },
        select: {
          userId: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const blogs = blogsData.map((blog) => ({
    ...blog,
    isSaved: blog.savedBy.length > 0,
  }));

  const totalBlogs = await prisma.blog.count({
    where: categoryId
      ? {
          categoryId,
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
  // set blog cache in redis
  await redis_client.set(cacheKey, JSON.stringify({ blogs, metaData }), {
    EX: 60 * 60 * 24, // 24 hours
  });

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
      category: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
  if (!blog) {
    throw createHttpError.NotFound("Blog Not Found.");
  }
  return blog;
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
  const cacheKey = `user-blogs:${id}:${page}:${limit}`;
  const cachedBlogs = await redis_client.get(cacheKey);
  if (cachedBlogs) {
    return JSON.parse(cachedBlogs);
  }
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
      category: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
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

  // set blog cache in redis
  await redis_client.set(cacheKey, JSON.stringify({ blogs, metaData }), {
    EX: 30 * 60, // 30 minutes
  });
  return { blogs, metaData };
};

// update a blog
export const updateBlogService = async ({
  id,
  title,
  content,
  categoryId,
  authorId,
}: {
  id: string;
  title: string;
  content: string;
  categoryId: string;
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
      categoryId,
    },
  });

  // delete all blogs cache
  deleteCache("blogs:*");

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

  // delete all blogs cache
  deleteCache("blogs:*");

  // delete categories cache because the blog count of categories will be changed
  deleteCache("categories");

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
      ],
    },
    include: {
      author: {
        select: {
          name: true,
          email: true,
        },
      },
      category: {
        select: {
          id: true,
          name: true,
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

// save blog
export const saveBlogService = async (blogId: string, userId: string) => {
  const blog = await prisma.blog.findUnique({
    where: { id: blogId },
  });
  if (!blog) {
    throw createHttpError.NotFound("Blog Not Found.");
  }
  const isSavedBlog = await prisma.savedBlog.findUnique({
    where: {
      userId_blogId: {
        userId,
        blogId,
      },
    },
  });
  // if blog is already saved then throw error
  if (isSavedBlog) {
    throw createHttpError.Conflict("Blog is already saved.");
  }
  // save blog
  const savedBlog = await prisma.savedBlog.create({
    data: { blogId, userId },
  });
  return savedBlog;
};

// unsave blog
export const unsaveBlogService = async (blogId: string, userId: string) => {
  const blog = await prisma.blog.findUnique({
    where: { id: blogId },
  });
  if (!blog) {
    throw createHttpError.NotFound("Blog Not Found.");
  }
  const isSavedBlog = await prisma.savedBlog.findUnique({
    where: {
      userId_blogId: {
        userId,
        blogId,
      },
    },
  });
  // if blog is not saved then throw error
  if (!isSavedBlog) {
    throw createHttpError.NotFound("Blog is not saved.");
  }
  // unsave blog
  const unsavedBlog = await prisma.savedBlog.delete({
    where: {
      userId_blogId: {
        userId,
        blogId,
      },
    },
  });
  return unsavedBlog;
};

// get all saved blogs
export const getSavedBlogsService = async ({
  page,
  limit,
  skip,
  userId,
}: {
  page: number;
  limit: number;
  skip: number;
  userId: string;
}) => {
  const savedBlogs = await prisma.savedBlog.findMany({
    skip,
    take: limit,
    where: {
      userId,
    },
    include: {
      blog: {
        include: {
          author: {
            select: {
              name: true,
              email: true,
            },
          },
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  const totalSavedBlogs = await prisma.savedBlog.count({
    where: {
      userId,
    },
  });
  const totalPages = Math.ceil(totalSavedBlogs / limit);
  const metaData = {
    totalSavedBlogs,
    totalPages,
    currentPage: page,
    limit,
  };
  const blogs = savedBlogs.map((savedBlog) => ({
    ...savedBlog.blog,
    isSaved: true,
  }));
  return { blogs, metaData };
};
