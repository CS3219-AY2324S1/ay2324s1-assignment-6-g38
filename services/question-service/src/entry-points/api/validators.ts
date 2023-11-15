import type { NextFunction, Request, Response } from "express";

import {
  AddQuestionSchema,
  GetQuestionSchema,
  UpdateQuestionSchema,
} from "../../domain/question-schema";

export function validateAddQuestionInput(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  try {
    AddQuestionSchema.parse(req.body);
    next();
  } catch (e: any) {
    res.status(400).json({ error: e.errors });
  }
}

export function validateGetQuestionRequest(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  try {
    GetQuestionSchema.parse(req.body);
    next();
  } catch (e: any) {
    res.status(400).json({ error: e.errors });
  }
}

export function validateUpdateQuestionInput(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  try {
    UpdateQuestionSchema.parse({
      id: req.params.id,
      ...req.body,
    });
    next();
  } catch (e: any) {
    res.status(400).json({ error: e.errors });
  }
}
