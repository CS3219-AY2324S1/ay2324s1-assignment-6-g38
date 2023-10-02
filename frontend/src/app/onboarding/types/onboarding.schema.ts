import * as z from 'zod';

export const CreateUserSchema = z.object({
    name: z.string().min(2).max(50),
    email: z.string().email(),
    url: z.string().url().nullable(),
    bio: z.string().max(300).nullable()
  })