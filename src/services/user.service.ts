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
      bio: true,
      address: true,
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

// get all users
export const getUserListService = async ({
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
  const users = await prisma.user.findMany({
    skip,
    take: limit,
    where: {
      id: {
        not: userId,
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
      id: {
        not: userId,
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

// update user profile
export const updateProfileService = async ({
  id,
  name,
  bio,
  address,
}: {
  id: string;
  name: string;
  bio: string;
  address: string;
}) => {
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    throw createHttpError.NotFound("User Not Found");
  }

  const updatedUser = await prisma.user.update({
    where: { id },
    data: { name, bio, address },
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
  const users = followers.map((f) => f.follower);

  return { users, metaData };
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

  const users = following.map((f) => f.following);

  return { users, metaData };
};

export const getAllAdminsService = async ({
  page,
  limit,
  skip,
  searchQuery,
}: {
  page: number;
  limit: number;
  skip: number;
  searchQuery: string;
}) => {
  const admins = await prisma.user.findMany({
    where: {
      OR: [{ role: "admin" }, { role: "super_admin" }],
      name: {
        contains: searchQuery,
        mode: "insensitive",
      },
    },
    skip,
    take: limit,
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      createdAt: true,
      updatedAt: true,
      role: true,
      _count: {
        select: {
          blogs: true,
          followers: true,
          following: true,
        },
      },
    },
  });
  const totalAdmins = await prisma.user.count({
    where: {
      role: "admin",
      name: {
        contains: searchQuery,
        mode: "insensitive",
      },
    },
  });
  const totalPages = Math.ceil(totalAdmins / limit);
  const metaData = {
    currentPage: page,
    limit,
    totalAdmins,
    totalPages,
  };
  return { admins, metaData };
};

// make user to admin
export const makeAdminService = async (id: string, authUserId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
    select: { role: true },
  });

  if (!user) {
    throw createHttpError.NotFound("User Not Found.");
  }

  if (user.role === "admin") {
    throw createHttpError.BadRequest("User is already an admin.");
  }

  if (user.role === "super_admin") {
    throw createHttpError.BadRequest("You can not make super admin.");
  }

  const updatedUser = await prisma.user.update({
    where: {
      id,
    },
    data: {
      role: "admin",
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      createdAt: true,
      updatedAt: true,
      role: true,
      _count: {
        select: {
          blogs: true,
          followers: true,
          following: true,
        },
      },
    },
  });
  return updatedUser;
};

// make admin --> user
export const makeUserService = async (id: string, authUserId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
    select: { role: true },
  });

  if (!user) {
    throw createHttpError.NotFound("User Not Found.");
  }

  if (user.role === "user") {
    throw createHttpError.BadRequest("User is already a user.");
  }

  if (user.role === "super_admin") {
    throw createHttpError.BadRequest("You can not demote super admin.");
  }

  const updatedUser = await prisma.user.update({
    where: {
      id,
    },
    data: {
      role: "user",
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      createdAt: true,
      updatedAt: true,
      role: true,
      _count: {
        select: {
          blogs: true,
          followers: true,
          following: true,
        },
      },
    },
  });
  return updatedUser;
};

export const deleteUserService = async (id: string, authUserId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  const authUser = await prisma.user.findUnique({
    where: {
      id: authUserId,
    },
    select: {
      role: true,
    },
  });

  if (!user) {
    throw createHttpError.NotFound("User Not Found.");
  }

  if (!authUser) {
    throw createHttpError.NotFound("Admin Not Found.");
  }

  if (user.role === "admin" && authUser.role !== "super_admin") {
    throw createHttpError.BadRequest("You can not delete admin.");
  }

  await prisma.user.delete({
    where: {
      id,
    },
  });
  return user;
};

// admin: get all users with role info
export const adminGetAllUsersService = async ({
  page,
  limit,
  skip,
  searchQuery,
}: {
  page: number;
  limit: number;
  skip: number;
  searchQuery?: string;
}) => {
  const users = await prisma.user.findMany({
    skip,
    take: limit,
    where: searchQuery
      ? {
          OR: [
            { name: { contains: searchQuery, mode: "insensitive" } },
            { email: { contains: searchQuery, mode: "insensitive" } },
          ],
        }
      : {},
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      createdAt: true,
      updatedAt: true,
      role: true,
      _count: {
        select: {
          blogs: true,
          followers: true,
          following: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const totalUsers = await prisma.user.count({
    where: searchQuery
      ? {
          OR: [
            { name: { contains: searchQuery, mode: "insensitive" } },
            { email: { contains: searchQuery, mode: "insensitive" } },
          ],
        }
      : {},
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

// dashboard stats
export const getDashboardStatsService = async () => {
  const [totalUsers, totalBlogs, totalAdmins, totalCategories] =
    await Promise.all([
      prisma.user.count(),
      prisma.blog.count(),
      prisma.user.count({ where: { role: "admin" } }),
      prisma.category.count(),
    ]);

  return { totalUsers, totalBlogs, totalAdmins, totalCategories };
};
