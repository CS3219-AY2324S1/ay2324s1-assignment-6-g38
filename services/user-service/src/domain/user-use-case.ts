import type { Role } from "@prisma/client";

import type { UpdateUser, UserFilter, UserWihoutId } from "../../types";
import * as userRepository from "../data-access/user-repository";

import {
  UpdateUserSchema,
  userIdSchema,
  UserRecordWithoutIdSchema,
} from "./user-schema"; // Import your schemas here
import {
  assertUserExistsById,
  assertUserExistsByMail,
  assertUserNotExistsByMail,
} from "./user-validator";

export async function getAllUser(filter: UserFilter) {
  const response = await userRepository.getAllUsers(filter);
  return response;
}

// Define a Zod validator for user ID
// ✅ Validate and add a new user
export async function addUser(newUser: UserWihoutId) {
  // Validate newUser against the AddUserSchema
  await assertUserNotExistsByMail(newUser.email);
  const validatedResult = UserRecordWithoutIdSchema.parse(newUser);
  const count = await userRepository.countUsers();
  if (count === 0) {
    const response = await userRepository.addUser({
      ...newUser,
      role: "ADMIN",
    });
    return response;
  }
  const response = await userRepository.addUser(validatedResult);
  return response;
}

// ✅ Delete a user by ID
export async function deleteUser(userId: number) {
  // Validate userId using the userIdValidator
  userIdSchema.parse(userId);
  await assertUserExistsById(userId);
  return userRepository.deleteUser(userId);
}

// ✅ Get a user by mail
export async function getUserById(userId: number) {
  // Validate userId using the userIdValidator
  await assertUserExistsById(userId);
  return userRepository.getUserById(userId);
}

export async function getUserByMail(mail: string) {
  // Validate userId using the userIdValidator
  await assertUserExistsByMail(mail);
  return userRepository.getUserByEmail(mail);
}

// ✅ Update a user by ID
export async function updateUser(
  userId: number,
  updateUserRequest: UpdateUser,
) {
  userIdSchema.parse(userId);
  await assertUserExistsById(userId);
  const validatedData = UpdateUserSchema.parse(updateUserRequest);
  return userRepository.updateUser(userId, validatedData);
}

export async function updateUserRole(userId: number, role: Role) {
  await assertUserExistsById(userId);
  return userRepository.updateUserRole(userId, role);
}

// Check if user is registered
