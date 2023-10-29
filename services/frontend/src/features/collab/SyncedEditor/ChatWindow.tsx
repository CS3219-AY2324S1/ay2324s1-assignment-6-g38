import { Send } from "lucide-react";
import { useState } from "react";
import { z } from "zod";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { cn } from "@/lib/utils";

import type { Message } from "../types";

import "./styles.css";

const FormSchema = z.object({
  message: z.string(),
});

type ChatWindowProps = {
  messages: Message[];
  sendMessage: (value: string | undefined) => void;
  currentUser: string;
};

export default function ChatWindow({
  messages,
  sendMessage,
  currentUser,
}: ChatWindowProps) {
  //   const [unsentMessage, setUnsentMessage] = useState<string>();

  //   const [messages, setMessages] = useState([
  //     {
  //       role: "agent",
  //       content: "Hi, how can I help you today?",
  //     },
  //     {
  //       role: "user",
  //       content: "Hey, I'm having trouble with my account.",
  //     },
  //     {
  //       role: "agent",
  //       content: "What seems to be the problem?",
  //     },
  //     {
  //       role: "user",
  //       content: "I can't log in.",
  //     },
  //   ]);
  const [input, setInput] = useState("");
  const inputLength = input.trim().length;

  const handleSendMessage = () => {
    sendMessage(input);
    setInput("");
  };

  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="flex flex-row items-center">
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src="/avatars/01.png" alt="Image" />
            <AvatarFallback>OM</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium leading-none">Sofia Davis</p>
            <p className="text-sm text-muted-foreground">m@example.com</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="grow overflow-y-auto">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={cn(
                "flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm",
                message.username === currentUser
                  ? "ml-auto bg-primary text-primary-foreground"
                  : "bg-muted",
              )}
            >
              {message.content}
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            handleSendMessage();
          }}
          className="flex w-full items-center space-x-2"
        >
          <Input
            id="message"
            placeholder="Type your message..."
            className="flex-1"
            autoComplete="off"
            value={input}
            onChange={(event) => setInput(event.target.value)}
          />
          <Button type="submit" size="icon" disabled={inputLength === 0}>
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
