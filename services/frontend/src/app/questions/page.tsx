"use client";

import React from "react";
import type * as z from "zod";

import type { QuestionWithoutIdType } from "@/features/questions";
import { QuestionCard, QuestionForm } from "@/features/questions";
import type { Question } from "@/features/questions/types/question.schema";

import {
  useAddQuestionMutation,
  useDeleteQuestionMutation,
  useGetQuestionsQuery,
} from "../../services/questionApi";

import { useApiNotifications } from "@/hooks/useApiNotifications";

const page = () => {
  const [
    addQuestion,
    { isSuccess: isAddSuccess, isLoading: isAddLoading, isError: isAddError },
  ] = useAddQuestionMutation();

  const [
    deleteQuestion,
    { isSuccess: isDeleteSuccess, isError: isDeleteError },
  ] = useDeleteQuestionMutation();

  const { data: questions = [], isError: isGetQuestionsError } =
    useGetQuestionsQuery();

  useApiNotifications({
    isSuccess: isAddSuccess,
    isError: isAddError,
    successMessage: "Question successfully added!",
    errorMessage:
      "Something went wrong while adding your question. Please try again later.",
  });

  useApiNotifications({
    isSuccess: isDeleteSuccess,
    isError: isDeleteError,
    successMessage: "Question successfully deleted!",
    errorMessage:
      "Something went wrong while deleting your question. Please try again later.",
  });

  useApiNotifications({
    isError: isGetQuestionsError,
    errorMessage:
      "Something went wrong while retrieving the questions. Please try again later.",
  });

  const handleAddQuestion = (newQuestion: z.infer<typeof Question>) => {
    addQuestion(newQuestion as QuestionWithoutIdType);
  };

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-screen-xl">
        <h1 className="mb-8 flex text-3xl font-bold">Questions Repository</h1>
        <div className="flex gap-8">
          <div className="w-1/2">
            <h1 className="mb-8 flex text-2xl">Add New Question</h1>
            <QuestionForm
              onSubmit={handleAddQuestion}
              formSubmitStatus={{
                isError: isAddError,
                isLoading: isAddLoading,
                isSuccess: isAddSuccess,
              }}
            />
          </div>
          <div className="w-1/2">
            <h1 className="mb-8 flex text-2xl">All Questions</h1>
            <div className="flex flex-col gap-4">
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
                      deleteQuestionError={isDeleteError}
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
