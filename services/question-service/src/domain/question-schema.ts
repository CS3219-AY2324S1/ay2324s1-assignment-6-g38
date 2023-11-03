import { z } from "zod";

import { Category, Difficulty } from "@prisma/client";

const CategorySchema = z.nativeEnum(Category);

export const QuestionRecordSchema = z.object({
  id: z.string(),
  title: z.string(),
  categories: z.array(CategorySchema),
  description: z.string(),
  difficulty: z.nativeEnum(Difficulty),
  link: z.string().url(),
});

export const AddQuestionSchema = QuestionRecordSchema.omit({ id: true });

export const AddQuestionsSchema = z.array(AddQuestionSchema);

export const GetQuestionSchema = QuestionRecordSchema.omit({
  description: true,
  link: true,
}).partial();

export const UpdateQuestionSchema = QuestionRecordSchema.omit({
  id: true,
}).partial();
