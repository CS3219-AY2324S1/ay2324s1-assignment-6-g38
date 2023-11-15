import express from "express";

import * as historyUseCase from "../../domain/history-usecase";

import {
  validateAddHistoryInput,
  validateDeleteHistoryInput,
  validateIsoDate,
  validateUpdateHistoryInput,
} from "./history-route-validators";

export default function defineRoutes(expressApp: express.Application) {
  const router = express.Router();

  router.post("/", validateAddHistoryInput, async (req, res, next) => {
    try {
      const addHistoryResponse = await historyUseCase.addHistory(req.body);
      res.json(addHistoryResponse);
    } catch (error) {
      next(error);
    }
  });

  router.get("/", validateIsoDate, async (req, res, next) => {
    try {
      // if present, will be parsed accordingly, else undefined
      const startDate = req.query.startDate as string | undefined; // Expecting a date string
      const endDate = req.query.endDate as string | undefined; // Expecting a date string

      const start = startDate ? new Date(startDate) : undefined;

      const end = endDate ? new Date(endDate) : undefined;

      const userId = req.query.userId
        ? parseInt(req.query.userId as string, 10)
        : undefined;

      const questionId = req.query.questionId as string | undefined;

      const response = await historyUseCase.getAllHistory({
        userId,
        questionId,
        start,
        end,
      });
      res.json(response);
    } catch (error) {
      next(error);
    }
  });

  router.get("/:id", async (req, res, next) => {
    try {
      const response = await historyUseCase.getHistoryById(
        parseInt(req.params.id, 10),
      );
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  });

  router.put("/:id", validateUpdateHistoryInput, async (req, res, next) => {
    try {
      const response = await historyUseCase.updateHistory(
        parseInt(req.params.id, 10),
        req.body,
      );
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  });

  router.delete("/:id", validateDeleteHistoryInput, async (req, res, next) => {
    try {
      const response = await historyUseCase.deleteHistory(
        parseInt(req.params.id, 10),
      );
      res.status(200).send(response);
    } catch (error) {
      next(error);
    }
  });

  router.delete("/", (req, res, next) => {
    res.status(400).json({ error: "ID is required" });
  });

  expressApp.use("/history", router);

  expressApp.get("/health", async (req, res, next) => {
    try {
      res.status(200).end("Healthy");
    } catch (error) {
      next(error);
    }
  });
}
