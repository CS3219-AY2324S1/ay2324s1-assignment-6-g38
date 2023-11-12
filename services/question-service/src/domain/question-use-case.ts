import type { QuestionFilter, QuestionRequest } from "../../types";
import * as questionRepo from "../data-access/question-repository";

import { AddQuestionSchema, UpdateQuestionSchema } from "./question-schema"; // Import your schemas here
import {
  assertQuestionExistsById,
  assertQuestionNotExistsByTitle,
} from "./question-validator";

export async function getQuestions(filter: QuestionFilter) {
  const response = await questionRepo.getQuestions(filter);
  return response;
}

export async function getQuestionById(questionId: string) {
  await assertQuestionExistsById(questionId);
  const response = await questionRepo.getQuestionById(questionId);
  return response;
}

export async function addQuestion(newQuestion: QuestionRequest) {
  await assertQuestionNotExistsByTitle(newQuestion.title);
  const validatedData = AddQuestionSchema.parse(newQuestion);
  const response = await questionRepo.addNewQuestion(validatedData);
  return response;
}

export async function deleteQuestion(questionId: string) {
  await assertQuestionExistsById(questionId);
  return questionRepo.deleteQuestion(questionId);
}

export async function updateQuestion(
  questionId: string,
  updateQuestionRequest: Partial<QuestionRequest>,
) {
  await assertQuestionExistsById(questionId);
  const validatedData = UpdateQuestionSchema.parse(updateQuestionRequest);
  return questionRepo.updateQuestion(questionId, validatedData);
}
