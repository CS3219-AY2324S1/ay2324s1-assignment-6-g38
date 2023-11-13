/* eslint-disable tailwindcss/no-custom-classname */

"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { io, type Socket } from "socket.io-client";

import type { MatchDetails, MatchRequest } from "@/features/match";
import { MatchingForm } from "@/features/match";
import { updateMatchDetails } from "@/features/match/state/matchSlice";
import { NotificationType, setNotification } from "@/features/notifications";

const page = () => {
  const dispatch = useDispatch();
  const { push } = useRouter();
  const URL = "http://localhost:6001";

  const socketRef = useRef<Socket>();
  const [queueTime, setQueueTime] = useState<number>();
  useEffect(() => {
    const socket = io(URL, { autoConnect: false });

    socket.on("error", (errorMessage: string) => {
      socketRef.current?.disconnect();
      setQueueTime(undefined);
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
    socketRef.current = socket;
  }, []);

  const handleMatchingSubmit = (values: MatchRequest) => {
    if (socketRef.current && values) {
      socketRef.current?.connect();
      const request = {
        socketId: socketRef.current.id,
        ...values,
      };
      socketRef.current.emit("register", request);
      setQueueTime(Date.now());
    }
  };

  const handleLeaveQueue = () => {
    if (socketRef.current && queueTime) {
      socketRef.current?.disconnect();
      setQueueTime(undefined);
    }
  };

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-screen-xl">
        <h1 className="mb-8 flex text-3xl font-bold">Partner Search</h1>
        <div className="flex gap-8">
          <div className="w-1/2">
            <h1 className="mb-8 flex text-2xl">Find a session</h1>
            <MatchingForm
              handleLeaveQueue={handleLeaveQueue}
              onSubmit={handleMatchingSubmit}
              matchPending={queueTime !== undefined}
              queueTime={queueTime}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
