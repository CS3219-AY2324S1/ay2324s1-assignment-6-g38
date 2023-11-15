import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import type { Socket } from "socket.io-client";

import { Editor, useMonaco } from "@monaco-editor/react";

import { Button } from "@/components/ui/button";

import type { Language } from "@/features/match";
import {
  resetMatchDetails,
  updateSessionEnded,
} from "@/features/match/state/matchSlice";
import { NotificationType, setNotification } from "@/features/notifications";
import type { QuestionType } from "@/features/questions";
import type { User } from "@/features/users";

import { useAddHistoryMutation } from "@/services/historyApi";

import { QuestionDisplay } from "../QuestionDisplay";
import type { Message } from "../types";
import { Status } from "../types";
import { ChatWindow } from "./ChatWindow";

import { useApiNotifications } from "@/hooks/useApiNotifications";

export function SyncedEditor({
  socket,
  language,
  question,
  roomId,
  user,
}: {
  socket: Socket;
  language: Language;
  question: QuestionType;
  roomId: string;
  user: User;
}) {
  const dispatch = useDispatch();
  const monaco = useMonaco();
  const { theme } = useTheme();
  const { push } = useRouter();

  const [partnerStatus, setPartnerStatus] = useState<Status>(
    Status.Disconnected,
  );
  const [sessionActive, setSessionActive] = useState<boolean>(true);
  const [partnerDetails, setPartnerDetails] = useState<User>();
  const [editorContent, setEditorContent] = useState<string>(
    "// add your code here",
  );

  const [chatMessages, setChatMessages] = useState<Message[]>([]);

  const [addHistory, { isSuccess: isSubmitSuccess, isError: isSubmitError }] =
    useAddHistoryMutation();

  useApiNotifications({
    isSuccess: isSubmitSuccess,
    isError: isSubmitError,
    successMessage: "Attempt successfully saved!",
    errorMessage:
      "Something went wrong saving your attempt. Please save your work manually before leaving this page.",
  });

  const monacoConfig = {
    fontSize: 14,
  };

  useEffect(() => {
    socket.removeAllListeners();
    socket.on("code_update", (content: string) => {
      setEditorContent(content);
    });

    socket.on("message", (messages: Message[]) => {
      // required to reference the most recent state of chatMessages
      setChatMessages((prevMessages: Message[]) => [
        ...prevMessages,
        ...messages,
      ]);
    });

    socket.on("error", (errorMessage: string) => {
      setPartnerStatus(Status.Disconnected);
      const notificationPayload = {
        type: NotificationType.ERROR,
        value: errorMessage,
      };
      dispatch(setNotification(notificationPayload));
      push("/matching");
    });

    socket.on("partner_intro_response", (connectedUser: User) => {
      setPartnerStatus(Status.Connected);
      setPartnerDetails(connectedUser);
    });

    socket.on("joined", (connectingUser: User) => {
      socket.emit("partner_intro_response", { roomId, user });
      setPartnerStatus(Status.Connected);
      setPartnerDetails(connectingUser);
      const notificationPayload = {
        type: NotificationType.SUCCESS,
        value: `${connectingUser.name} has joined`,
      };
      dispatch(setNotification(notificationPayload));
    });

    socket.on("end_session", () => {
      dispatch(updateSessionEnded());
      setPartnerStatus(Status.SessionEnded);
      setSessionActive(false);
      const notificationPayload = {
        type: NotificationType.ERROR,
        value: "Your partner has ended the session",
      };
      dispatch(setNotification(notificationPayload));
      socket.disconnect();
      addHistory({
        userId: user.id,
        questionId: question.id,
        question,
        submittedCode: editorContent,
      });
    });

    socket.on("disconnected", () => {
      if (partnerStatus !== Status.SessionEnded) {
        setPartnerStatus(Status.Disconnected);
      }
      const notificationPayload = {
        type: NotificationType.ERROR,
        value: "Your partner has disconnected",
      };
      dispatch(setNotification(notificationPayload));
    });

    socket.connect();
    socket.emit("join", { roomId, connectingUser: user });
    return () => {
      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOnEditorChange = (value: string | undefined) => {
    socket.emit("code_update", {
      content: value,
      to: roomId,
    });
  };

  const handleEndSession = async () => {
    socket.emit("leave", roomId);
    socket.disconnect();
    dispatch(updateSessionEnded());
    setSessionActive(false);
    setPartnerStatus(Status.SessionEnded);
    addHistory({
      userId: user.id,
      questionId: question.id,
      question,
      submittedCode: editorContent,
    })
      .unwrap()
      .then(() => {
        push("/");
      });
  };

  const handleLeave = () => {
    dispatch(resetMatchDetails());
    push("/");
  };

  const sendMessage = (value: string | undefined) => {
    if (value) {
      const message = {
        userId: user.id.toString(),
        content: value,
      } as Message;
      socket.emit("message", {
        to: roomId,
        message,
      });
      setChatMessages((messages: Message[]) => [...messages, message]);
    }
  };

  useEffect(() => {
    if (monaco) {
      if (theme === "dark") {
        monaco.editor.setTheme("vs-dark");
      } else {
        monaco.editor.setTheme("vs");
      }
    }
  }, [monaco, theme]);

  return (
    <div className="flex h-[80vh] gap-2">
      <div className="w-4/12">
        <QuestionDisplay contentClassName="max-h-[60vh]" question={question} />
      </div>
      <div className="w-5/12 overflow-hidden rounded-lg border py-2 shadow-sm">
        <Editor
          value={editorContent}
          defaultLanguage={language}
          onChange={handleOnEditorChange}
          options={monacoConfig}
        />
      </div>
      <div className="flex w-3/12 flex-col gap-y-2">
        <ChatWindow
          contentClassName="max-h-[60vh]"
          messages={chatMessages}
          sendMessage={sendMessage}
          currentUser={user.id.toString()}
          partnerDetails={partnerDetails}
          partnerStatus={partnerStatus as string}
          isDisabled={!sessionActive}
        />
        {sessionActive ? (
          <Button variant="destructive" onClick={handleEndSession}>
            End Session
          </Button>
        ) : (
          <Button variant="secondary" onClick={handleLeave}>
            Leave
          </Button>
        )}
      </div>
    </div>
  );
}
