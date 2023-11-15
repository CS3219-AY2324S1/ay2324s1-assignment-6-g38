"use client";

import React from "react";
import { useDispatch } from "react-redux";
import type * as z from "zod";

import { NotificationType, setNotification } from "@/features/notifications";
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
  const dispatch = useDispatch();
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
    addQuestion(newQuestion as QuestionWithoutIdType)
      .unwrap()
      .then(() => {
        const notificationPayload = {
          type: NotificationType.SUCCESS,
          value: "Question successfully saved!",
        };
        dispatch(setNotification(notificationPayload));
      })
      .catch((error) => {
        let errorMessage =
          "Something went wrong while saving the questions. Please try again later.";
        if (error.status === 409) {
          errorMessage =
            "Duplicate: Existing question found with the same title or link found.";
        }
        const notificationPayload = {
          type: NotificationType.ERROR,
          value: errorMessage,
        };
        dispatch(setNotification(notificationPayload));
      });
  };

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-screen-xl">
        <h1 className="mb-4 text-4xl font-bold tracking-tight">
          Questions Repository
        </h1>
        <div className="mt-4 flex gap-8">
          <div className="w-1/2">
            <h1 className="mb-2 text-2xl font-semibold tracking-tight">
              Add New Question
            </h1>
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
            <h1 className="mb-2 text-2xl font-semibold tracking-tight">
              All Questions
            </h1>
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
