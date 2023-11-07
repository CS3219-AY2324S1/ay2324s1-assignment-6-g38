import express from "express";

import type { Category, Difficulty } from "@prisma/client";

import * as questionUseCase from "../../domain/question-use-case";

import {
  validateAddQuestionInput,
  validateGetQuestionRequest,
  validateUpdateQuestionInput,
} from "./validators";

export default function defineRoutes(expressApp: express.Application) {
  const router = express.Router();

  router.post("/", validateAddQuestionInput, async (req, res, next) => {
    try {
      const addQuestionResponse = await questionUseCase.addQuestion(req.body);
      res.json(addQuestionResponse);
    } catch (error) {
      next(error);
    }
  });

  router.get("/", validateGetQuestionRequest, async (req, res, next) => {
    try {
      const { categories } = req.query;
      const response = await questionUseCase.getQuestions({
        id: req.query.id as string,
        title: req.query.title as string,
        difficulty: req.query.difficulty as Difficulty,
        categories: (!categories || Array.isArray(categories)
          ? categories
          : [categories]) as Category[],
      });
      if (!req.query.getOne || !response) {
        res.json(response);
      } else {
        res.json(response[Math.floor(Math.random() * response.length)]);
      }
    } catch (error) {
      next(error);
    }
  });

  router.get("/:id", async (req, res, next) => {
    try {
      const response = await questionUseCase.getQuestionById(req.params.id);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  });

  router.patch("/:id", validateUpdateQuestionInput, async (req, res, next) => {
    try {
      const response = await questionUseCase.updateQuestion(
        req.params.id,
        req.body,
      );
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  });

  router.delete("/:id", async (req, res, next) => {
    try {
      await questionUseCase.deleteQuestion(req.params.id);
      res.status(200).end();
    } catch (error) {
      next(error);
    }
  });

  expressApp.use("/question", router);

  expressApp.get("/healthz", async (req, res, next) => {
    try {
      res.status(200).end("Healthy");
    } catch (error) {
      next(error);
    }
  });
}
