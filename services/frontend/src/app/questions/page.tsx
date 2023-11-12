"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";

import type { QuestionType } from "@/features/questions";
import { QuestionCard, QuestionForm } from "@/features/questions";

const page = () => {
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [loadNumQuestions, setLoadNumQuestions] = useState<boolean>(false);

  useEffect(() => {
    const storedQuestions = JSON.parse(
      localStorage.getItem("questions") || "[]",
    );

    setQuestions(storedQuestions);
    setLoadNumQuestions(true);
  }, [questions]);

  const addQuestion = (newQuestion: QuestionType) => {
    setQuestions((prevQuestions) => [...prevQuestions, newQuestion]);
    localStorage.setItem(
      "questions",
      JSON.stringify([...questions, newQuestion]),
    );
    toast.success("Question added successfully!");
  };

  const deleteQuestion = (id: string) => {
    const existingQuestions: QuestionType[] = JSON.parse(
      localStorage.getItem("questions") || "[]",
    );

    // Filter out the question with the given id
    const updatedQuestions = existingQuestions.filter(
      (question) => question.id.toString() !== id,
    );

    // Save the updated list back to local storage
    localStorage.setItem("questions", JSON.stringify(updatedQuestions));
    toast.success("Question deleted successfully!");
  };

  const renderNumQuestions = (numQuestions: number) => {
    if (numQuestions === 0) {
      return "No Questions";
    }
    return `${numQuestions} Question${numQuestions > 1 ? "s" : ""}`;
  };

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-screen-xl">
        <h1 className="mb-8 flex text-3xl font-bold">Questions Repository</h1>
        <div className="flex gap-8">
          <div className="w-1/2">
            <h1 className="mb-8 flex text-2xl">Add New Question</h1>
            <QuestionForm
              addQuestion={addQuestion}
              currentQuestions={questions}
            />
          </div>
          <div className="w-1/2">
            <h1 className="mb-8 flex text-2xl">
              {loadNumQuestions ? renderNumQuestions(questions.length) : null}
            </h1>
            <div className="mr-4 flex max-h-[60vh] flex-col gap-4 overflow-y-auto">
              {questions.map(
                ({ id, title, categories, difficulty, description, link }) => (
                  <div key={id.toString()}>
                    <QuestionCard
                      id={id}
                      title={title}
                      categories={categories}
                      difficulty={difficulty}
                      description={description}
                      link={link}
                      deleteQuestion={deleteQuestion}
                    />
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
