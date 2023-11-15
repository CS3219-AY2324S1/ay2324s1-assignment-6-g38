import HttpError from "../commons/error";
import * as questionRepository from "../data-access/question-repository";

export async function assertQuestionExistsById(id: string) {
  const question = await questionRepository.getQuestions({
    id,
    isDeleted: false,
  });
  if (!question?.length) {
    throw new HttpError(`Question with ID: '${id}' not found`, 404);
  }
}

export async function assertQuestionNotExistsByTitle(title: string) {
  const question = await questionRepository.getQuestions({
    title,
    isDeleted: false,
  });
  if (question?.length) {
    throw new HttpError(
      `Question with this title: '${title}' already exists. ID: '${question[0].id}'`,
      409,
    );
  }
}

export async function assertQuestionNotExistByLink(link: string) {
  const questions = await questionRepository.getQuestions({
    link,
    isDeleted: false,
  });
  if (questions && questions.length > 0) {
    throw new HttpError(
      `Question with this link: '${link}' already exists. ID: '${questions[0].id}'`,
      409,
    );
  }
}
