import type { UpdateUser, User, UserFilter, UserWihoutId } from "../types";

import { getPrismaClient } from "./prisma-client-factory";

export async function addUser(newUserRequest: UserWihoutId): Promise<User> {
  const resultUser = await getPrismaClient().user.create({
    data: { ...newUserRequest },
  });

  return resultUser;
}

export async function getAllUsers(filter: UserFilter): Promise<User[]> {
  const users = await getPrismaClient().user.findMany({
    where: { email: filter.email },
  });
  return users;
}

export async function getUserById(id: number): Promise<User | null> {
  const resultUser = await getPrismaClient().user.findUnique({
    where: {
      id,
    },
  });
  return resultUser;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const user = await getPrismaClient().user.findUnique({
    where: {
      email,
    },
  });
  return user;
}

export async function isUserRegistered(email: string): Promise<boolean> {
  const user = await getPrismaClient().user.findUnique({
    where: {
      email,
    },
  });

  return !!user;
}

export async function updateUser(
  id: number,
  updateUserRequest: UpdateUser,
): Promise<User> {
  const resultUser = await getPrismaClient().user.update({
    where: { id },
    data: { ...updateUserRequest },
  });
  return resultUser;
}

export async function deleteUser(userIdToDelete: number): Promise<User> {
  const deleteResult = await getPrismaClient().user.delete({
    where: {
      id: userIdToDelete,
    },
  });
  return deleteResult;
}

export async function cleanupData(): Promise<any> {
  const deleteResult = await getPrismaClient().user.deleteMany();
  return deleteResult;
}
