import {
  historyIdSchema,
  HistoryRecordWithoutIdAndTimestampSchema,
  UpdateHistorySchema,
} from "../commons/types/history-schema";
import type {
  HistoryFilter,
  HistoryWithoutId,
  UpdateHistory,
} from "../commons/types/history-types";
import * as historyRepository from "../data-access/history-repository";
import * as questionService from "../services/question-service";

import {
  assertHistoryExistsById,
  assertValidQuestionId,
  assertValidUserId,
} from "./history-usecase-validators";

export async function getAllHistory(filter: HistoryFilter) {
  // validate userId and questionId
  if (filter.userId) {
    await assertValidUserId(filter.userId);
  }
  if (filter.questionId) {
    await assertValidQuestionId(filter.questionId);
  }

  // retrieve all histories
  const history = await historyRepository.getAllHistories(filter);

  // add question to each history
  let questionMap = new Map();

  if (filter.questionId) {
    // if questionId is specified in the filter, fetch only that question
    const question = await questionService.getQuestionById(filter.questionId);
    questionMap.set(filter.questionId, question);
  } else {
    // if questionId is not specified, fetch all questions
    const questions = await questionService.getAllQuestions();
    questionMap = new Map(questions.map((q) => [q.id, q]));
  }

  const historyWithQuestions = history.map((h) => {
    const question = questionMap.get(h.questionId);
    return { ...h, question };
  });

  return historyWithQuestions;
}

export async function addHistory(newHistory: HistoryWithoutId) {
  const { userId, questionId } = newHistory;

  // validate history
  const validatedResult =
    HistoryRecordWithoutIdAndTimestampSchema.parse(newHistory);

  // validate userId and questionId
  if (userId) {
    await assertValidUserId(userId);
  }
  if (questionId) {
    await assertValidQuestionId(questionId);
  }

  // create history resource
  const response = await historyRepository.addHistory(validatedResult);
  return response;
}

export async function deleteHistory(historyId: number) {
  historyIdSchema.parse(historyId);
  await assertHistoryExistsById(historyId);
  return historyRepository.deleteHistory(historyId);
}

export async function getHistoryById(historyId: number) {
  // Validate historyId using the historyIdValidator
  await assertHistoryExistsById(historyId);
  return historyRepository.getHistoryById(historyId);
}

export async function updateHistory(
  historyId: number,
  updateHistoryRequest: UpdateHistory,
) {
  historyIdSchema.parse(historyId);
  await assertHistoryExistsById(historyId);
  const validatedData = UpdateHistorySchema.parse(updateHistoryRequest);
  return historyRepository.updateHistory(historyId, validatedData);
}
