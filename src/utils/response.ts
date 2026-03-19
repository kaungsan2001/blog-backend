import type { Response } from "express";

export function successResponse({
  res,
  data,
  message,
  statusCode = 200,
}: {
  res: Response;
  data: any;
  message: string;
  statusCode?: number;
}) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}

export function errorResponse(
  res: Response,
  message: string,
  statusCode: number = 500,
) {
  return res.status(statusCode).json({
    success: false,
    message,
  });
}
