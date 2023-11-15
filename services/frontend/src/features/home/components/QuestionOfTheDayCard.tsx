import React from "react";

import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

import { CategoryBadge, type QuestionType } from "@/features/questions";

import { MatchingDialog } from "./MatchingDialog";

interface QuestionOfTheDayCardProps {
  question: QuestionType | undefined;
}

export const QuestionOfTheDayCard: React.FC<QuestionOfTheDayCardProps> = ({
  question,
}) => {
  if (question) {
    const { title, categories, difficulty, link } = question!;
    return (
      <Card className="min-w-[33%]">
        <CardHeader>
          <div className="flex justify-between gap-2">
            <CardTitle>{title}</CardTitle>
            <p className="font-mono text-xs font-bold uppercase tracking-tighter text-gray-500 dark:text-gray-400">
              {difficulty}
            </p>
          </div>
          <CategoryBadge categories={categories} />
        </CardHeader>
        <CardFooter className="flex items-end justify-end">
          <MatchingDialog question={question} />
        </CardFooter>
      </Card>
    );
  }
  return (
    <Card className="min-w-[33%]">
      <CardHeader>No question of the day</CardHeader>
    </Card>
  );
};
