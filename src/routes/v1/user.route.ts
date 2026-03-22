import { Router } from "express";
import {
  getUserByIdController,
  getUserBlogsController,
  getUserListController,
  searchUserController,
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

const router = Router();

router.get(
  "/details/:id",
  getUserByIdValidator,
  validatedMiddleware,
  getUserByIdController,
);
router.get(
  "/:id/blogs",
  getUserBlogsValidator,
  validatedMiddleware,
  getUserBlogsController,
);
router.get(
  "/",
  getUserListValidator,
  validatedMiddleware,
  getUserListController,
);

router.put(
  "/profile",
  authMiddleware,
  updateProfileValidator,
  validatedMiddleware,
  updateProfileController,
);

router.get(
  "/search",
  searchUserValidator,
  validatedMiddleware,
  searchUserController,
);
export default router;
