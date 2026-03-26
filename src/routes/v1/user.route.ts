import { Router } from "express";
import {
  getUserByIdController,
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
  getUserListValidator,
  updateProfileValidator,
  searchUserValidator,
} from "../../validators/user.validator";
import { updateProfileController } from "../../controllers/user.controller";
import authMiddleware from "../../middlewares/auth.middleware";
import { followUserValidator } from "../../validators/blog.validator";

const router = Router();

// get user by id route
router.get(
  "/details/:userId",
  authMiddleware,
  getUserByIdValidator,
  validatedMiddleware,
  getUserByIdController,
);

// get all users route
router.get(
  "/",
  authMiddleware,
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
router.get("/followers", authMiddleware, getAllFollowersController);

// get all following route
router.get("/following", authMiddleware, getAllFollowingController);

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
  followUserValidator,
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
