"use client";

import { CheckIcon, ChevronsUpDown } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

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

import { cn } from "@/lib/utils";

import type { Difficulty } from "@/features/questions";
import { categoriesStub } from "@/features/questions/stubs/categories.stub";

import { Match } from "../types/match.schema";
import type { MatchRequest } from "../types/match.type";
import { Language } from "../types/match.type";

interface MatchFormProps {
  handleLeaveQueue: () => void;
  onSubmit: (values: MatchRequest) => void;
  matchPending: boolean;
  queueTime: number | undefined;
}

export const MatchingForm: React.FC<MatchFormProps> = ({
  handleLeaveQueue,
  onSubmit,
  matchPending,
  queueTime,
}) => {
  const [buttonText, setButtonText] = useState<string>("Waiting...");
  const form = useForm<z.infer<typeof Match>>({
    resolver: zodResolver(Match),
    defaultValues: {
      difficulty: "",
      language: "",
      category: "",
    },
    mode: "all",
  });

  const handleSubmit = (values: z.infer<typeof Match>) => {
    console.log("Submitting", values);
    onSubmit({
      language: values.language as Language,
      difficulty: values.difficulty as Difficulty,
      category: values.category,
    });
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (queueTime) {
      timer = setInterval(() => {
        const secondsDiff = Math.floor((Date.now() - queueTime) / 1000);
        const minutes = Math.floor(secondsDiff / 60)
          .toString()
          .padStart(2, "0");
        const seconds = (secondsDiff % 60).toString().padStart(2, "0");
        setButtonText(`${minutes}:${seconds}`);
      }, 1000);
    }
    // eslint-disable-next-line consistent-return
    return () => clearTimeout(timer);
  }, [queueTime]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="category"
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
                        "justify-between bg-background",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      {field.value || "Select categories"}
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
                            const currentValues = form.getValues("category");
                            const valueSet = new Set(currentValues);

                            if (valueSet.has(category)) {
                              valueSet.delete(category);
                            } else {
                              valueSet.add(category);
                            }

                            form.setValue("category", category);
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
          name="language"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Language</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    {field.value ? (
                      <SelectValue placeholder="Select a language" />
                    ) : (
                      "Select a language"
                    )}
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.keys(Language).map((lang) => (
                    <SelectItem key={lang} value={lang}>
                      {lang}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-4">
          <Button
            className="w-[20%]"
            type="submit"
            disabled={
              !(form.getValues("difficulty") && form.getValues("language"))
            }
            isLoading={matchPending}
            loadingText={buttonText}
          >
            Submit
          </Button>
          {matchPending ? (
            <Button
              variant="destructive"
              type="button"
              onClick={handleLeaveQueue}
            >
              Leave Queue
            </Button>
          ) : null}
        </div>
        <div className="text-center">
          <p className="text-xs font-normal text-muted-foreground">
            Warning: Leaving this page will remove you from the queue.
          </p>
        </div>
      </form>
    </Form>
  );
};
