import { formatISO } from "date-fns";

import type { QuestionFilter, QuestionRequest } from "../../types";
import HttpError from "../commons/error/HttpError";
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

function dateToHash(date) {
  const today = formatISO(date, { representation: "date" });
  let hash = 0;
  for (let i = 0; i < today.length; i += 1) {
    const char = today.charCodeAt(i);
    hash = hash * 31 + char;
    hash = Math.sign(hash) * Math.trunc(Math.abs(hash));
  }
  return Math.abs(hash);
}

export async function getDailyQuestion() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const questionOfTheDay = await questionRepo.getQuestionOfTheDay(today);

  if (questionOfTheDay) {
    const question = await getQuestionById(questionOfTheDay.questionId);
    return question;
  }
  const questions = await questionRepo.getQuestions({});
  if (questions === null || questions!.length === 0) {
    throw new HttpError("No questions in database", 404);
  }
  const questionIndex = dateToHash(new Date()) % questions.length;
  await questionRepo.addQuestionOfTheDay(today, questions[questionIndex].id);

  return questions[questionIndex];
}
