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
} from "../../validators/user.validator";

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

export default router;
