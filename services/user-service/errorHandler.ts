import type { NextFunction, Request, Response } from "express";
import HttpError from "./error/index";

export function errorHandler(
  error: HttpError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Handle the error here and send an appropriate response
  // Customize the response based on the error
  res.status(error.statusCode).json({ error: error.message });
}
