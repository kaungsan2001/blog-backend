import { validationResult } from "express-validator";
import type { Request, Response, NextFunction } from "express";
import { errorResponse } from "../utils/response";
import createHttpError from "http-errors";

export const validatedMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    throw createHttpError.BadRequest("Invalid Input");
  }
  next();
};
