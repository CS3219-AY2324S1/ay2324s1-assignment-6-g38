export interface QuestionType {
  id: string;
  title: string;
  categories: string[];
  difficulty: Difficulty;
  description: string;
  link: string;
  isHtml: boolean;
}

export type QuestionWithoutIdType = Omit<QuestionType, "id">;

export interface QuestionDescription {
  id: string;
  description: string;
}

export enum Difficulty {
  Easy = "Easy",
  Medium = "Medium",
  Hard = "Hard",
}
