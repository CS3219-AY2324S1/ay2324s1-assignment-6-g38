import type { Difficulty } from "@/features/questions/types/question.type";

export enum Language {
  CoffeeScript = "coffescript",
  Cpp = "cpp",
  CSharp = "csharp",
  Java = "java",
  JavaScript = "javascript",
  Php = "php",
  Python = "python",
  Ruby = "ruby",
  TypeScript = "typescript",
}

export type MatchRequest = {
  difficulty: Difficulty;
  language: Language;
  category: string;
};

export type MatchDetails = {
  category: string;
  difficulty: Difficulty;
  roomId: string;
  language: Language;
};
