import type { NextFunction, Request, Response } from "express";

import type HttpError from "./src/commons/error";

export function errorHandler(
  error: HttpError,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // Handle the error here and send an appropriate response
  console.error(error); // Log the error for debugging purposes
  // Customize the response based on the error
  res.status(error.statusCode).json({ error: error.message });
}
