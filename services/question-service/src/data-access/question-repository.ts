import type {
  QuestionFilter,
  QuestionRecord,
  QuestionRequest,
} from "../../types";

import { getPrismaClient } from "./prisma-client-factory";

export async function addNewQuestion(
  newQuestionRecordRequest: QuestionRequest,
): Promise<QuestionRecord> {
  return getPrismaClient().question.create({
    data: newQuestionRecordRequest,
  });
}

export async function getQuestions(
  filter: Partial<QuestionFilter>,
): Promise<QuestionRecord[] | null> {
  // hasSome cannot take in undefined :(
  if (filter.categories) {
    return getPrismaClient().question.findMany({
      where: {
        id: filter.id,
        title: filter.title,
        difficulty: filter.difficulty,
        categories: {
          hasSome: filter.categories,
        },
      },
    });
  }
  return getPrismaClient().question.findMany({
    where: {
      id: filter.id,
      title: filter.title,
      difficulty: filter.difficulty,
    },
  });
}

export async function getQuestionById(
  id: string,
): Promise<QuestionRecord | null> {
  const question = getPrismaClient().question.findUnique({
    where: {
      id,
    },
  });
  return question;
}

export async function updateQuestion(
  id: string,
  updateUserRequest: Partial<QuestionRequest>,
): Promise<QuestionRecord> {
  return getPrismaClient().question.update({
    where: { id },
    data: updateUserRequest,
  });
}

export async function deleteQuestion(id: string): Promise<QuestionRecord> {
  return getPrismaClient().question.delete({
    where: {
      id,
    },
  });
}
