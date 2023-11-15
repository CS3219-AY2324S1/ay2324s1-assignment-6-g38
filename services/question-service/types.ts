import type { Difficulty } from "@prisma/client";

export type QuestionRecord = {
  id: string;
  title: string;
  categories: string[];
  difficulty: Difficulty;
  description: string;
  link: string;
  isDeleted: boolean;
};

export type QuestionGetQueryParams = Partial<
  Omit<QuestionRecord, "isDeleted">
> & {
  isDeleted?: string;
};

export type QuestionRequest = Omit<QuestionRecord, "id">;

export type QuestionFilter = {
  id?: string;
  title?: string;
  categories?: string;
  difficulty?: Difficulty;
  description?: string;
  link?: string;
  isDeleted?: boolean;
};
