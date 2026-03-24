import createHttpError from "http-errors";
import { prisma } from "../db";

// get user by id
export const getUserByIdService = async ({
  target_userId,
  userId,
}: {
  target_userId: string;
  userId: string;
}) => {
  const userData = await prisma.user.findUnique({
    where: { id: target_userId },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          blogs: true,
          followers: true,
          following: true,
        },
      },
      followers: {
        where: { followerId: userId },
        select: {
          id: true,
        },
        take: 1,
      },
    },
  });

  if (!userData) {
    throw createHttpError.NotFound("User Not Found");
  }

  // remove followers , only response isFollowing->boolean
  const { followers, ...rest } = userData;
  const user = { ...rest, isFollowing: !!followers.length };
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

// follow user
export const followUserService = async ({
  followerId,
  followingId,
}: {
  followerId: string;
  followingId: string;
}) => {
  if (followerId === followingId) {
    throw createHttpError.BadRequest("You cannot follow yourself");
  }
  const user = await prisma.user.findUnique({
    where: { id: followingId },
  });

  if (!user) {
    throw createHttpError.NotFound("User Not Found");
  }

  const isFollowing = await prisma.follow.findUnique({
    where: {
      followerId_followingId: { followerId, followingId },
    },
  });

  if (isFollowing) {
    throw createHttpError.BadRequest("You are already following this user");
  }

  const followed = await prisma.follow.create({
    data: { followerId, followingId },
  });

  return followed;
};

// unfollow user
export const unfollowUserService = async ({
  followerId,
  followingId,
}: {
  followerId: string;
  followingId: string;
}) => {
  if (followerId === followingId) {
    throw createHttpError.BadRequest("You cannot unfollow yourself");
  }
  const user = await prisma.user.findUnique({
    where: { id: followingId },
  });

  if (!user) {
    throw createHttpError.NotFound("User Not Found");
  }

  const isFollowing = await prisma.follow.findUnique({
    where: {
      followerId_followingId: { followerId, followingId },
    },
  });

  if (!isFollowing) {
    throw createHttpError.BadRequest("You are not following this user");
  }

  const unfollowed = await prisma.follow.delete({
    where: {
      followerId_followingId: { followerId, followingId },
    },
  });

  return unfollowed;
};

// get all followers
export const getAllFollowersService = async ({
  userId,
  page,
  limit,
  skip,
}: {
  userId: string;
  page: number;
  limit: number;
  skip: number;
}) => {
  const followers = await prisma.follow.findMany({
    skip,
    take: limit,
    where: { followingId: userId },
    include: {
      follower: {
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          updatedAt: true,
        },
        include: {
          _count: {
            select: {
              blogs: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const totalFollowers = await prisma.follow.count({
    where: { followingId: userId },
  });
  const totalPages = Math.ceil(totalFollowers / limit);
  const metaData = {
    totalFollowers,
    totalPages,
    currentPage: page,
    limit,
  };

  return { followers, metaData };
};

// get all following
export const getAllFollowingService = async ({
  userId,
  page,
  limit,
  skip,
}: {
  userId: string;
  page: number;
  limit: number;
  skip: number;
}) => {
  const following = await prisma.follow.findMany({
    skip,
    take: limit,
    where: { followerId: userId },
    include: {
      following: {
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          updatedAt: true,
        },
        include: {
          _count: {
            select: {
              blogs: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const totalFollowing = await prisma.follow.count({
    where: { followerId: userId },
  });
  const totalPages = Math.ceil(totalFollowing / limit);
  const metaData = {
    totalFollowing,
    totalPages,
    currentPage: page,
    limit,
  };

  return { following, metaData };
};
