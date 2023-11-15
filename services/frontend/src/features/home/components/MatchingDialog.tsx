"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { io, type Socket } from "socket.io-client";
import type { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { MatchDetails } from "@/features/match";
import { Language, MatchByQuestionId } from "@/features/match";
import { selectMatchState } from "@/features/match/state/matchSelector";
import {
  resetMatchDetails,
  updateMatchDetails,
} from "@/features/match/state/matchSlice";
import { NotificationType, setNotification } from "@/features/notifications";
import { CategoryBadge, type QuestionType } from "@/features/questions";

interface MatchingDialogProps {
  question: QuestionType;
}

export const MatchingDialog = ({ question }: MatchingDialogProps) => {
  const URL = "http://localhost:6001";
  const { title, categories, difficulty, id } = question;
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const dispatch = useDispatch();
  const { push } = useRouter();
  const socketRef = useRef<Socket>();
  const [matchPending, setMatchPending] = useState<boolean>(false);
  const { hasOngoingSession } = useSelector(selectMatchState);

  const form = useForm<z.infer<typeof MatchByQuestionId>>({
    resolver: zodResolver(MatchByQuestionId),
    defaultValues: {
      language: "",
      questionId: id,
    },
    mode: "all",
  });

  const handleSubmit = (values: z.infer<typeof MatchByQuestionId>) => {
    console.log("Submitting", values);
    if (socketRef.current && values) {
      socketRef.current?.connect();
      const request = {
        ...values,
      };
      socketRef.current.emit("register", request);
      setMatchPending(true);
    }
  };

  useEffect(() => {
    const socket = io(URL, { autoConnect: false });

    socket.on("error", (errorMessage: string) => {
      socketRef.current?.disconnect();
      setMatchPending(false);
      const notificationPayload = {
        type: NotificationType.ERROR,
        value: errorMessage,
      };
      dispatch(setNotification(notificationPayload));
    });

    socket.on("match", (match: MatchDetails) => {
      socketRef.current?.disconnect();
      dispatch(updateMatchDetails(match));
      push("/collab");
    });

    socket.on("disconnect", () => {
      setMatchPending(false);
      dispatch(resetMatchDetails());
    });
    socketRef.current = socket;

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  useEffect(() => {
    if (isDialogOpen === false) {
      socketRef.current?.disconnect();
    }
  }, [isDialogOpen]);

  return (
    <Dialog onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="default" disabled={hasOngoingSession}>
          Find Match
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Find Match</DialogTitle>
          <DialogDescription>
            Select a language you want to work in. We will match you with a peer
            who is searching for a match with the same language.
          </DialogDescription>
        </DialogHeader>

        <div>
          <Card className="min-w-[33%]">
            <CardHeader>
              <div className="flex justify-between gap-2">
                <CardTitle className="text-xl tracking-tight">
                  {title}
                </CardTitle>
                <p className="font-mono text-xs font-bold uppercase tracking-tighter text-gray-500 dark:text-gray-400">
                  {difficulty}
                </p>
              </div>
              <CategoryBadge categories={categories} />
            </CardHeader>
          </Card>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-8"
          >
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
            <DialogFooter>
              <Button
                type="submit"
                disabled={
                  !(form.getValues("language") && form.getValues("questionId"))
                }
                isLoading={matchPending}
                loadingText="Matching"
              >
                Find Match
              </Button>
            </DialogFooter>
            <p className="text-xs font-normal text-muted-foreground">
              Warning: Closing this popup will remove you from the queue.
            </p>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
