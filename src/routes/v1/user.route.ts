import { Router } from "express";
import {
  getUserByIdController,
  getUserBlogsController,
  getUserListController,
  searchUserController,
  unfollowUserController,
  getAllFollowersController,
  getAllFollowingController,
  followUserController,
} from "../../controllers/user.controller";
import { validatedMiddleware } from "../../middlewares/validated.middleware";
import {
  getUserByIdValidator,
  getUserBlogsValidator,
  getUserListValidator,
  updateProfileValidator,
  searchUserValidator,
} from "../../validators/user.validator";
import { updateProfileController } from "../../controllers/user.controller";
import authMiddleware from "../../middlewares/auth.middleware";
import {
  followUserValidator,
  getAllFollowersValidator,
  getAllFollowingValidator,
  unfollowUserValidator,
} from "../../validators/blog.validator";

const router = Router();

// get user by id route
router.get(
  "/details/:id",
  getUserByIdValidator,
  validatedMiddleware,
  getUserByIdController,
);

// get user blogs route by user id
router.get(
  "/:id/blogs",
  getUserBlogsValidator,
  validatedMiddleware,
  getUserBlogsController,
);

// get all users route
router.get(
  "/",
  getUserListValidator,
  validatedMiddleware,
  getUserListController,
);

// search users route
router.get(
  "/search",
  searchUserValidator,
  validatedMiddleware,
  searchUserController,
);

// get all followers route
router.get(
  "/:userId/followers",
  getAllFollowersValidator,
  validatedMiddleware,
  getAllFollowersController,
);

// get all following route
router.get(
  "/:userId/following",
  getAllFollowingValidator,
  validatedMiddleware,
  getAllFollowingController,
);

// follow user route
router.post(
  "/follow/:userId",
  authMiddleware,
  followUserValidator,
  validatedMiddleware,
  followUserController,
);

// unfollow user route
router.delete(
  "/unfollow/:userId",
  authMiddleware,
  unfollowUserValidator,
  validatedMiddleware,
  unfollowUserController,
);

// update user profile route
router.put(
  "/profile",
  authMiddleware,
  updateProfileValidator,
  validatedMiddleware,
  updateProfileController,
);

export default router;
