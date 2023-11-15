import { z } from "zod";

import { Difficulty } from "@prisma/client";

export const QuestionRecordSchema = z.object({
  id: z.string(),
  title: z.string(),
  categories: z.array(z.string()),
  description: z.string(),
  difficulty: z.nativeEnum(Difficulty),
  link: z.string().url(),
  isDeleted: z.boolean().optional(),
});

export const AddQuestionSchema = QuestionRecordSchema.omit({ id: true });

export const GetQuestionSchema = QuestionRecordSchema.extend({
  getOne: z.boolean().optional(),
})
  .omit({
    description: true,
    link: true,
  })
  .partial();

export const UpdateQuestionSchema = QuestionRecordSchema.omit({
  id: true,
}).partial();
