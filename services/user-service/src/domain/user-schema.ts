import { z } from "zod";

// Define the UserRecord schema
export const UserRecordSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  name: z.string(),
  bio: z.string().max(300).optional().nullable(),
  url: z.string().url().optional().nullable(),
});

// Schema for the addUser function
export const UserRecordWithoutIdSchema = UserRecordSchema.omit({ id: true });

// Schema for the updateUser function
export const UpdateUserSchema = UserRecordWithoutIdSchema.partial();

export const userIdSchema = z.number();
