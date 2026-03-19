import { auth } from "../lib/auth";
import type { NextFunction, Request, Response } from "express";
import { fromNodeHeaders } from "better-auth/node";
import createHttpError from "http-errors";
import asyncHandler from "express-async-handler";

declare module "express-serve-static-core" {
  interface Request {
    user: {
      id: string;
      name: string;
      email: string;
    };
  }
}

const authMiddleware = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });
    if (!session) {
      throw createHttpError(401, "Unauthorized");
    }
    req.user = session.user;
    next();
  },
);

export default authMiddleware;
