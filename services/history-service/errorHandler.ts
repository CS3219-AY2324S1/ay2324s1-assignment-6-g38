import type { NextFunction, Request, Response } from "express";

import HttpError from "./src/commons/error/HttpError";

export function errorHandler(
  error: HttpError,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (error instanceof HttpError) {
    // handle HttpError instances
    res.status(error.statusCode).json({ error: error.message });
  } else {
    // handle uncaught errors
    console.error(error);
    res.status(500).json({ error: "Uncaught error encountered" });
  }
}
