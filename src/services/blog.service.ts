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
}: {
  id: string;
  title?: string;
  content?: string;
  category?: string;
  image?: string;
}) => {
  const blog = await prisma.blog.update({
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
  return blog;
};

export const deleteBlogService = async (id: string) => {
  const blog = await prisma.blog.delete({
    where: {
      id,
    },
  });
  return blog;
};
