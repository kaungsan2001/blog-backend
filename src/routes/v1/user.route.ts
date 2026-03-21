import { Router } from "express";
import {
  getUserByIdController,
  getUserBlogsController,
  getUserListController,
} from "../../controllers/user.controller";
import { validatedMiddleware } from "../../middlewares/validated.middleware";
import {
  getUserByIdValidator,
  getUserBlogsValidator,
  getUserListValidator,
  updateProfileValidator,
} from "../../validators/user.validator";
import { updateProfileController } from "../../controllers/user.controller";
import authMiddleware from "../../middlewares/auth.middleware";

const router = Router();

router.get(
  "/:id",
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

export default router;
