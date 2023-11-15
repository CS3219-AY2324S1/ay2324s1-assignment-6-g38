import axios from "axios";

import HttpError from "../commons/error/HttpError";

export type User = {
  id: number;
  name: string;
  email: string;
};

const { USER_SERVICE_BASE_URL } = process.env;

export async function getUserById(userId: number): Promise<User> {
  try {
    const response = await axios.get<User>(
      `${USER_SERVICE_BASE_URL}/user/${userId}`,
    );
    return response.data;
  } catch (error) {
    throw new HttpError(`User ${userId} does not exist`, 500);
  }
}
