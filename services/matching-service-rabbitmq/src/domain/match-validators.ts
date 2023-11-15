import pino from "pino";

import { getQuestion, getQuestionById } from "../services/question-service";

const logger = pino();

export const assertQuestionExists = async (
  difficulty: string,
  categories: string,
): Promise<void> => {
  const params = new URLSearchParams({
    difficulty,
    categories,
    getOne: "true",
  });

  try {
    const res = await getQuestion(params);

    // Check if response is OK and has content
    if (!res.ok) {
      throw new Error(`Request failed with status ${res.status}`);
    }

    // Check for empty response body
    if (res.headers.get("content-length") === "0") {
      throw new Error(
        `No question exists with difficulty: ${difficulty} and category: ${categories}`,
      );
    }

    const question = await res.json();
    logger.info(
      `Successfully fetched question for difficulty: ${difficulty}, category: ${categories}`,
      question,
    );
  } catch (error) {
    logger.error(`Failed assertion: ${error.message}`);
    throw error;
  }
};

export const assertQuestionExistsById = async (
  questionId: string,
): Promise<void> => {
  const res = await getQuestionById(questionId);

  if (!res.ok) {
    throw new Error(`Request failed with status ${res.status}`);
  }

  if (res.headers.get("content-length") === "0") {
    throw new Error(`Question with id: ${questionId} does not exist`);
  }

  const question = await res.json();
  logger.info(
    `Successfully fetched question for question id: ${questionId}`,
    question,
  );
};

export const assertNotAlreadyInQueue = (
  socket: string,
  otherSocket: string,
): boolean => {
  const notInQueue = socket !== otherSocket;
  if (!notInQueue) {
    logger.warn(`Socket ${socket} is already in the queue.`);
  }
  return notInQueue;
};
