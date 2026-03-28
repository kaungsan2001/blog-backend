import { auth } from "../lib/auth";
import type { NextFunction, Request, Response } from "express";
import { fromNodeHeaders } from "better-auth/node";
import createHttpError from "http-errors";
import asyncHandler from "express-async-handler";

const superAdminMiddleware = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });
    if (!session) {
      throw createHttpError(401, "Unauthorized");
    }
    req.user = session.user as any;
    if (session.user.role !== "super_admin") {
      throw createHttpError(403, "Forbidden: Super Admin access required");
    }
    next();
  },
);

export default superAdminMiddleware;
