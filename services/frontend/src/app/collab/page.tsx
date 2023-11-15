/* eslint-disable tailwindcss/no-custom-classname */

"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import type { Socket } from "socket.io-client";
import { io } from "socket.io-client";

import { selectAuthData } from "@/features/auth";
import { SyncedEditor } from "@/features/collab/SyncedEditor/SyncedEditor";
import { selectMatchState } from "@/features/match/state/matchSelector";

import "./styles.css";

const page = () => {
  const { push } = useRouter();
  const { hasOngoingSession, language, question, roomId } =
    useSelector(selectMatchState);
  const socketRef = useRef<Socket>();
  const [currentUser, setCurrentUser] = useState<number>(
    Math.floor(Math.random() * 10000),
  );
  const auth = useSelector(selectAuthData);
  const URL = "http://localhost:4001";

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (!hasOngoingSession) {
      push("/matching");
    }
    if (!(language && question && roomId)) {
      push("/matching");
    }

    if (socketRef.current) {
      return;
    }

    const socket = io(URL, { autoConnect: false });
    if (auth.currentUser?.id) {
      setCurrentUser(auth.currentUser?.id);
    }
    socket.auth = {
      username: currentUser,
    };
    socketRef.current = socket;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return socketRef.current &&
    language &&
    question &&
    roomId &&
    auth.currentUser ? (
    <SyncedEditor
      socket={socketRef.current}
      language={language}
      question={question}
      roomId={roomId}
      user={auth.currentUser}
    />
  ) : null;
};

export default page;
