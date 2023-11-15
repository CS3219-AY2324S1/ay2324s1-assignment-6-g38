import { Loader2, Send } from "lucide-react";
import { useState } from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { cn } from "@/lib/utils";

import type { User } from "@/features/users";

import type { Message } from "../types";

import "./styles.css";

type ChatWindowProps = {
  messages: Message[];
  sendMessage: (value: string | undefined) => void;
  contentClassName: string;
  currentUser: string;
  partnerDetails: User | undefined;
  partnerStatus: string;
  isDisabled: boolean;
};

export function ChatWindow({
  messages,
  sendMessage,
  contentClassName,
  currentUser,
  partnerDetails,
  partnerStatus,
  isDisabled,
}: ChatWindowProps) {
  const [input, setInput] = useState("");
  const inputLength = input.trim().length;

  const handleSendMessage = () => {
    sendMessage(input);
    setInput("");
  };

  const getInitials = (name: string) => {
    const names = name.split(" ");
    let initials = names[0].substring(0, 1).toUpperCase();

    if (names.length > 1) {
      initials += names[names.length - 1].substring(0, 1).toUpperCase();
    }
    return initials;
  };

  const renderPartnerDetails = () => {
    return partnerDetails ? (
      <a href={`/users/${partnerDetails.id}`}>
        <div className="mb-2 flex items-center space-x-4">
          <Avatar>
            <AvatarFallback>{getInitials(partnerDetails.name)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium leading-none">
              {partnerDetails.name}
            </p>
            <p className="text-sm text-muted-foreground">
              {partnerDetails.email}
            </p>
          </div>
        </div>
      </a>
    ) : null;
  };

  const renderLoadingDetails = () => {
    return (
      <div className="mb-2 flex items-center space-x-4">
        <Loader2 className="m-auto animate-spin" />
        <div>
          <p className="text-sm font-medium leading-none">
            Waiting for partner to connect...
          </p>
          <p className="text-sm text-muted-foreground">...</p>
        </div>
      </div>
    );
  };

  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="flex flex-col">
        <div className="flex flex-row items-center overflow-x-auto">
          {partnerDetails ? renderPartnerDetails() : renderLoadingDetails()}
        </div>
        <hr className="mt-8 h-px border-0 bg-gray-200 dark:bg-gray-700" />
        <p className="text-center text-sm text-muted-foreground">
          Status: {partnerStatus}
        </p>
        <hr className="my-8 h-px border-0 bg-gray-200 dark:bg-gray-700" />
      </CardHeader>
      <CardContent className={`grow overflow-y-auto ${contentClassName}`}>
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={cn(
                "break-words flex w-max max-w-[70%] flex-col gap-2 rounded-lg px-3 py-2 text-sm",
                message.userId === currentUser
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
            disabled={isDisabled}
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
