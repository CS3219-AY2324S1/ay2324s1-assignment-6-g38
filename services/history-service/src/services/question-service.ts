import axios from "axios";

import HttpError from "../commons/error/HttpError";

// Define the types that you expect to receive from the User service
export type Question = {
  id: string;
  title: string;
  categories: Array<string>;
  difficulty: string;
  description: string;
  link: string;
};

const { QUESTION_SERVICE_BASE_URL } = process.env;

export async function getQuestionById(questionId: string): Promise<Question> {
  try {
    const response = await axios.get<Question>(
      `${QUESTION_SERVICE_BASE_URL}/question/${questionId}`,
    );
    return response.data;
  } catch (error) {
    throw new HttpError(
      `An error occurred while fetching questions from the question service`,
      500,
    );
  }
}

export async function getAllQuestions(): Promise<Question[]> {
  try {
    const response = await axios.get<Question[]>(
      `${QUESTION_SERVICE_BASE_URL}/question`,
    );
    return response.data;
  } catch (error) {
    throw new HttpError(
      `An error occurred while fetching questions from the questions service`,
      500,
    );
  }
}
