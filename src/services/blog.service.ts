import createHttpError from "http-errors";
import { prisma } from "../db";
import redis_client from "../lib/redis";
import { deleteCache } from "../utils/deleteCache";
import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";
import { uploadImage } from "../utils/imageUpload";

// create new blog
export const createBlogService = async ({
  imageBuffer,
  title,
  content,
  categoryId,
  authorId,
  isPublished,
}: {
  imageBuffer?: Buffer;
  title: string;
  content: string;
  categoryId: string;
  authorId: string;
  isPublished: boolean;
}) => {
  let uploadResult;
  if (imageBuffer) {
    uploadResult = await new Promise<UploadApiResponse>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "blogs",
            resource_type: "image",
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else if (result) {
              resolve(result);
            } else {
              reject(
                createHttpError.InternalServerError("Failed to upload image"),
              );
            }
          },
        )
        .end(imageBuffer);
    });
    if (!uploadResult.public_id) {
      throw createHttpError.InternalServerError("Failed to upload image");
    }
  }

  const blog = await prisma.blog.create({
    data: {
      title,
      content,
      categoryId,
      authorId,
      isPublished,
      image: uploadResult?.public_id,
    },
  });

  // delete all blogs cache
  deleteCache("blogs:*");

  // delete user's blogs cache
  deleteCache(`user-blogs:${authorId}:*`);

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
    where: {
      isPublished: true,
      ...(categoryId && { categoryId }), // if categoryId is provided then filter by categoryId
    },
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
    where: {
      isPublished: true,
      ...(categoryId && { categoryId }),
    },
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
export const getBlogByIdService = async (id: string, userId: string) => {
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
  // blog owner  -> blog -> published or draft
  // other users -> blog -> published
  if (blog.authorId !== userId && !blog.isPublished) {
    throw createHttpError.Unauthorized(
      "You are not authorized to view this blog",
    );
  }
  return blog;
};

// get user's blogs
export const getUserBlogsService = async ({
  authorId,
  authUserId,
  page,
  limit,
  skip,
  isPublished,
}: {
  authorId: string;
  authUserId: string;
  page: number;
  limit: number;
  skip: number;
  isPublished: boolean;
}) => {
  const cacheKey = `user-blogs:${authorId}:${page}:${limit}:${isPublished}`;
  const cachedBlogs = await redis_client.get(cacheKey);
  if (cachedBlogs) {
    return JSON.parse(cachedBlogs);
  }
  const blogs = await prisma.blog.findMany({
    skip,
    take: limit,
    where: {
      authorId,
      ...(authUserId !== authorId ? { isPublished: true } : { isPublished }),
      // if request user is not owner of the blog then only published blogs will be returned
      // if request user is owner of the blog then allow to filter by isPublished=true or false
    },
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
    where: {
      authorId,
      ...(authUserId !== authorId && { isPublished }),
    },
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
  isPublished,
  imageBuffer,
}: {
  id: string;
  title: string;
  content: string;
  categoryId: string;
  authorId: string;
  isPublished: boolean;
  imageBuffer?: Buffer;
}) => {
  const blog = await prisma.blog.findUnique({
    where: {
      id,
    },
  });
  if (!blog) {
    throw createHttpError.NotFound("Blog Not Found.");
  }
  // only owner can update the blog
  if (blog.authorId !== authorId) {
    throw createHttpError.Unauthorized(
      "You are not authorized to update this blog",
    );
  }

  let uploadResult: any;
  if (imageBuffer) {
    // delete old image if exist
    if (blog.image) {
      await cloudinary.uploader.destroy(blog.image);
    }
    uploadResult = await uploadImage(imageBuffer);
    if (!uploadResult.public_id) {
      throw createHttpError.InternalServerError("Failed to upload image");
    }
  }
  const updatedBlog = await prisma.blog.update({
    where: {
      id,
    },
    data: {
      title,
      content,
      categoryId,
      isPublished,
      ...(uploadResult?.public_id && { image: uploadResult.public_id }),
    },
  });

  // delete all blogs cache
  deleteCache("blogs:*");
  deleteCache(`user-blogs:${authorId}:*`);
  deleteCache("categories");

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

  // only owner can delete the blog
  if (blog.authorId !== userId) {
    throw createHttpError.Unauthorized(
      "You are not authorized to delete this blog",
    );
  }

  // if blog has image then delete it from cloudinary
  if (blog.image) {
    await cloudinary.uploader.destroy(blog.image);
  }
  const deletedBlog = await prisma.blog.delete({
    where: { id },
  });

  // delete all blogs cache
  deleteCache("blogs:*");

  // delete user's blogs cache
  deleteCache(`user-blogs:${userId}:*`);

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
      isPublished: true,
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
      isPublished: true,
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
    select: {
      isPublished: true,
      authorId: true,
    },
  });
  if (!blog) {
    throw createHttpError.NotFound("Blog Not Found.");
  }
  // blog owner can save both published and draft blogs
  // other users can save only published blogs
  if (!blog.isPublished && blog.authorId !== userId) {
    throw createHttpError.Unauthorized(
      "You are not authorized to save this blog",
    );
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
      blog: {
        OR: [{ isPublished: true }, { authorId: userId }],
        // if blog is published then return
        // if blog is draft then return only if authorId is equal to userId
      },
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
      blog: {
        OR: [{ isPublished: true }, { authorId: userId }],
      },
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
