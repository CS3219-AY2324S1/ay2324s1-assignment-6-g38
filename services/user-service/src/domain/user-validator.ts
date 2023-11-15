import HttpError from "../commons/error/index";
import * as userRepository from "../data-access/user-repository";

export async function assertUserExistsById(id: number) {
  const user = await userRepository.getUserById(id);
  if (!user) {
    throw new HttpError(`User with id ${id} does not exist`, 404);
  }
}
export async function assertUserExistsByMail(mail: string) {
  const user = await userRepository.getUserByEmail(mail);
  if (!user) {
    throw new HttpError(`User with email ${mail} does not exist`, 404);
  }
}

export async function assertUserNotExistsByMail(mail: string) {
  const user = await userRepository.getUserByEmail(mail);
  if (user) {
    throw new HttpError(`User with email ${mail} already exists`, 409);
  }
}
