import HttpError from "../commons/error";
import * as questionRepository from "../data-access/question-repository";

export async function assertQuestionExistsById(id: string) {
  const question = await questionRepository.getQuestions({ id });
  if (!question?.length) {
    throw new HttpError(`Question with ID: '${id}' not found`, 404);
  }
}

export async function assertQuestionNotExistsByTitle(title: string) {
  const question = await questionRepository.getQuestions({ title });
  if (question?.length) {
    throw new HttpError(
      `Question with this title: '${title}' already exists. ID: '${question[0].id}'`,
      409,
    );
  }
}
