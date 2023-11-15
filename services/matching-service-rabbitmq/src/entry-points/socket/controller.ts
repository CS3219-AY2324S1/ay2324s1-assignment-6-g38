import pino from "pino";
import type { Server } from "socket.io";

import type { Match } from "../../commons/types";
import { findMatch } from "../../domain/match-usecase";

import { validateInput } from "./validators";

const logger = pino();

export const defineEventListeners = (io: Server) => {
  io.on("connection", (socket) => {
    logger.info(`User connected with socket id: ${socket.id}`);

    socket.on("register", async (data: Match) => {
      logger.info(`Received register event from ${socket.id}`);
      logger.debug(`Register data: ${JSON.stringify(data)}`);

      // Validate inputs for both match types
      const isValid = await validateInput(data, socket);
      if (!isValid) {
        logger.warn(`Input validation failed for socket id: ${socket.id}`);
        return;
      }

      logger.info(`Input validation succeeded for socket id: ${socket.id}`);
      await findMatch(data, io, socket);
    });

    socket.on("disconnecting", () => {
      io.to(socket.id).emit(
        "error",
        "Connection lost. Please try again in a while.",
      );
      logger.warn(`User disconnected with socket id: ${socket.id}`);
    });
  });
};
