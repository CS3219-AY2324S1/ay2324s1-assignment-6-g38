/* eslint-disable tailwindcss/no-custom-classname */

"use client";

import { useEffect, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";
import { toast } from "sonner";

import type { MatchDetails, MatchRequest } from "@/features/match";
import { MatchingForm } from "@/features/match";

const page = () => {
  const URL = "http://localhost:6001";

  const socketRef = useRef<Socket>();
  const [matchPending, setMatchPending] = useState<boolean>(false);

  useEffect(() => {
    const socket = io(URL, { autoConnect: false });

    socket.on("error", (errorMessage: string) => {
      socketRef.current?.disconnect();
      setMatchPending(false);
      toast.error(errorMessage);
    });

    socket.on("match", (match: MatchDetails) => {
      socketRef.current?.disconnect();
      toast.success(`Found a match! Room ID: ${match.roomId}`);
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
      setMatchPending(true);
    }
  };

  const handleLeaveQueue = () => {
    if (socketRef.current && matchPending) {
      socketRef.current?.disconnect();
      setMatchPending(false);
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
              matchPending={matchPending}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
