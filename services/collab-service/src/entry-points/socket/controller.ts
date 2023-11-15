import pino from "pino";
import { type Server } from "socket.io";

import type { Message, User } from "../../commons/types";
import {
  resetCacheTimeouts,
  sendCache,
  setCacheTimeouts,
  updateCodeCache,
  updateMessageCache,
} from "../../data-access/collab-caches";

const logger = pino();

export const defineEventListeners = (io: Server) => {
  io.on("connection", (socket) => {
    socket.on(
      "join",
      ({
        roomId,
        connectingUser,
      }: {
        roomId: string;
        connectingUser: User;
      }) => {
        if (socket.rooms.has(roomId)) {
          return;
        }
        io.in(roomId)
          .fetchSockets()
          .catch((e) => logger.error(e))
          .then((connectedSockets) => {
            sendCache(socket, roomId);
            if (!connectedSockets || connectedSockets.length > 1) {
              io.to(socket.id).emit(
                "error",
                "The session is full, please try to find another match again.",
              );
              return;
            }
            const connectedSocket = connectedSockets[0];
            socket.join(roomId);

            if (connectedSocket) {
              socket.to(roomId).emit("joined", connectingUser);
            } else {
              resetCacheTimeouts(roomId);
            }
          });
      },
    );

    socket.on(
      "partner_intro_response",
      ({ roomId, user }: { roomId: string; user: User }) => {
        socket.to(roomId).emit("partner_intro_response", user);
      },
    );

    socket.on(
      "code_update",
      ({ content, to }: { content: string; to: string }) => {
        socket.to(to).emit("code_update", content);
        updateCodeCache(to, content);
      },
    );

    socket.on(
      "message",
      ({ to, message }: { to: string; message: Message }) => {
        logger.info(
          `received message: "${message.content}" from: ${message.userId}`,
        );
        socket.to(to).emit("message", [message]);
        updateMessageCache(to, message);
      },
    );

    socket.on("leave", (roomId: string) => {
      io.to(roomId).emit("end_session");
      io.in(roomId)
        .fetchSockets()
        .catch((e) => logger.error(e))
        .then((connectedSockets) => {
          if (connectedSockets) {
            connectedSockets.forEach((remainingSocket) => {
              remainingSocket.disconnect();
            });
          }
        });
    });

    socket.on("disconnecting", () => {
      for (const room of socket.rooms) {
        if (room === socket.id) {
          continue;
        }
        io.to(room).emit("disconnected");
        io.in(room)
          .fetchSockets()
          .catch((e) => logger.error(e))
          .then((connectedSockets) => {
            if (connectedSockets?.length && connectedSockets?.length < 2) {
              setCacheTimeouts(room, 600000);
            }
          });
      }
    });
  });
};
