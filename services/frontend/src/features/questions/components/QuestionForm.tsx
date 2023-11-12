"use client";

import { CheckIcon, ChevronsUpDown } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import type * as z from "zod";

import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { cn } from "@/lib/utils";

import type { QuestionType } from "..";
import { categoriesStub } from "../stubs/categories.stub";
import { Question } from "../types/question.schema";

interface QuestionFormProps {
  addQuestion: (newQuestion: QuestionType) => void;
  currentQuestions: QuestionType[];
}

export const QuestionForm: React.FC<QuestionFormProps> = ({
  addQuestion,
  currentQuestions,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const form = useForm<z.infer<typeof Question>>({
    resolver: zodResolver(Question),
    defaultValues: {
      title: "",
      link: "",
      difficulty: "",
      description: "",
      categories: [],
    },
    mode: "all",
  });

  function onSubmit(values: z.infer<typeof Question>) {
    setIsLoading(true);
    const uniqueId = Math.floor(Math.random() * 1000000).toString();
    const newQuestion = { ...values, id: uniqueId };

    // Check for duplicate titles or URLs
    const isDuplicate = currentQuestions.some(
      (question) =>
        question.title === newQuestion.title ||
        question.link === newQuestion.link,
    );

    if (isDuplicate) {
      alert("Error: Duplicate title or URL found.");
      setIsLoading(false);
      return;
    }

    // need to cast type due to how zod deals with array attributes
    addQuestion(newQuestion as QuestionType);
    console.log("[Question Form] Creating Question", newQuestion);
    console.log("[Question Form] Question Created, ID: ", uniqueId);

    setIsLoading(false);
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter question title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="categories"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Categories</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "justify-between",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      <p className="max-h-8 overflow-y-auto">
                        {field.value && field.value.length > 0
                          ? field.value
                              .map((val) =>
                                categoriesStub.find(
                                  (category) => category === val,
                                ),
                              )
                              .filter(Boolean)
                              .join(", ")
                          : "Select categories"}
                      </p>
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search categories..."
                      className="h-9"
                    />
                    <CommandEmpty>No category found.</CommandEmpty>
                    <CommandGroup className="h-60 overflow-y-auto">
                      {categoriesStub.map((category) => (
                        <CommandItem
                          value={category}
                          key={category}
                          onSelect={() => {
                            const currentValues = form.getValues("categories");
                            const valueSet = new Set(currentValues);

                            if (valueSet.has(category)) {
                              valueSet.delete(category);
                            } else {
                              valueSet.add(category);
                            }

                            form.setValue(
                              "categories",
                              // required to suppress zod compatibility issues with array objects
                              Array.from(valueSet) as [string, ...string[]],
                            );
                          }}
                        >
                          {category}
                          <CheckIcon
                            className={cn(
                              "ml-auto h-4 w-4",
                              field.value.includes(category)
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="difficulty"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Difficulty</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    {field.value ? (
                      <SelectValue placeholder="Select a difficulty" />
                    ) : (
                      "Select a difficulty"
                    )}
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Easy">Easy</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Hard">Hard</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter question description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="link"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Link</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter question URL"
                  {...field}
                  type="text"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={!form.formState.isValid}
          isLoading={isLoading}
        >
          Submit
        </Button>
      </form>
    </Form>
  );
};
