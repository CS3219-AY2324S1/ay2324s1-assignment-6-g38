import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import type { QuestionType } from "@/features/questions";
import { CategoryBadge } from "@/features/questions";

import "./styles.css";

type QuestionDisplayProps = {
  question: QuestionType;
  contentClassName?: string;
};

export function QuestionDisplay({
  question,
  contentClassName,
}: QuestionDisplayProps) {
  const { title, categories, difficulty, description, link } = question;
  return (
    <Card className="h-full">
      <CardHeader>
        <p className="text-xs font-bold text-gray-500 dark:text-gray-400">
          {difficulty}
        </p>
        <CardTitle className="overflow-x-auto text-2xl">{title}</CardTitle>
        <CardDescription className="overflow-x-auto">
          <CategoryBadge categories={categories} />
        </CardDescription>
      </CardHeader>
      <CardContent className={`${contentClassName} overflow-auto text-xs`}>
        <div dangerouslySetInnerHTML={{ __html: description }} />
      </CardContent>
    </Card>
  );
}
