import pino from "pino";
import type { Socket } from "socket.io";

import type { Message } from "../commons/types";

const logger = pino();
const codeCache: Map<string, string> = new Map();
const messageCache: Map<string, Message[]> = new Map();
const timeouts: Map<string, NodeJS.Timeout> = new Map();

export const sendCache = (socket: Socket, roomId: string) => {
  if (codeCache.has(roomId)) {
    socket.emit("code_update", codeCache.get(roomId));
  }
  if (messageCache.has(roomId)) {
    socket.emit("message", messageCache.get(roomId));
  }
};

export const updateCodeCache = (roomId: string, code: string) => {
  codeCache.set(roomId, code);
};

export const updateMessageCache = (roomId: string, message: Message) => {
  if (messageCache.has(roomId)) {
    messageCache.get(roomId)!.push(message);
  } else {
    messageCache.set(roomId, [message]);
  }
};

export const setCacheTimeouts = (roomId: string, timeoutDuration: number) => {
  logger.info(`setting cache timeout for empty room: ${roomId}`);
  const clearCacheTimeout = setTimeout(() => {
    messageCache.delete(roomId);
    codeCache.delete(roomId);
    logger.info(`cleared caches for room: ${roomId}`);
  }, timeoutDuration);
  timeouts.set(roomId, clearCacheTimeout);
};

export const resetCacheTimeouts = (roomId: string) => {
  if (timeouts.has(roomId)) {
    clearTimeout(timeouts.get(roomId));
    timeouts.delete(roomId);
  }
};
