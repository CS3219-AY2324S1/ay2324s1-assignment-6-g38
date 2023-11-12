import { Link as LinkIcon } from "lucide-react";
import React, { useState } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import type { Difficulty } from "../types/question.type";
import { CategoryBadge } from "./CategoryBadge";

export interface QuestionCardProps {
  id: string;
  title: string;
  categories: Array<string>;
  description: string;
  difficulty: Difficulty;
  link: string;
  deleteQuestion: (id: string) => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  id,
  title,
  categories,
  difficulty,
  description,
  link,
  deleteQuestion,
}) => {
  const [isDeletePending, setIsDeletePending] = useState<boolean>(false);

  const handleButtonClick = () => {
    setIsDeletePending(true);
    deleteQuestion(id);
  };

  return (
    <Card>
      <Accordion type="single" collapsible>
        <AccordionItem value="description">
          <CardHeader>
            <AccordionTrigger className="py-0">
              <div className="flex flex-col items-start gap-2">
                <p className="text-xs font-bold text-gray-500 dark:text-gray-400">
                  {difficulty}
                </p>
                <CardTitle className="max-h-[8vh] overflow-y-auto">
                  {title}
                </CardTitle>
              </div>
            </AccordionTrigger>
            <CardDescription>
              <div className="mb-8 flex gap-2 overflow-x-auto">
                <CategoryBadge categories={categories} />
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AccordionContent className="break-words">
              <p className="max-h-[30vh] overflow-y-auto ">
                {description.split("\n").map((line, index) => (
                  <React.Fragment key={`${line}-${index}`}>
                    {line}
                    <br />
                  </React.Fragment>
                ))}
              </p>
            </AccordionContent>
          </CardContent>

          <CardFooter className="flex justify-between">
            <a href={link} target="_blank" rel="noopener noreferrer">
              <Button variant="secondary" size="icon">
                <LinkIcon />
              </Button>
            </a>
            <Button
              variant="outline"
              isLoading={isDeletePending}
              onClick={handleButtonClick}
            >
              Delete
            </Button>
          </CardFooter>
        </AccordionItem>
      </Accordion>
    </Card>
  );
};
