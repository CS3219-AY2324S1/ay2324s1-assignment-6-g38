import HttpError from "../commons/error/HttpError";
import * as historyRepository from "../data-access/history-repository";
import { getQuestionById } from "../services/question-service";
import { getUserById } from "../services/user-service";

export async function assertHistoryExistsById(id: number) {
  const history = await historyRepository.getHistoryById(id);
  if (!history) {
    throw new HttpError(`History with id ${id} does not exist`, 404);
  }
}

export async function assertHistoryNotExistsByUserIdAndQuestionId(
  userId: number,
  questionId: string,
) {
  const history = await historyRepository.getHistoryByUserIdAndQuestionId(
    userId,
    questionId,
  );
  if (history && history.length > 0) {
    throw new HttpError(
      `History record with userId ${userId} and questionId ${questionId} already exists`,
      409,
    );
  }
}

export async function assertValidUserId(userId: number): Promise<void> {
  try {
    await getUserById(userId);
  } catch (error) {
    throw new HttpError(`Invalid userId: ${userId}. User does not exist.`, 422);
  }
}

export async function assertValidQuestionId(questionId: string): Promise<void> {
  try {
    await getQuestionById(questionId);
  } catch (error) {
    throw new HttpError(
      `Invalid questionId: ${questionId}. Question does not exist.`,
      422,
    );
  }
}
