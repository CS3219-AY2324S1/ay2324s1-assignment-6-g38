import pino from "pino";
import type { Server, Socket } from "socket.io";
import { v4 as uuidv4 } from "uuid";

import type { Difficulty, Language, Match } from "../commons/types";
import {
  getChannelInstance,
  getMessage,
  sendMessage,
} from "../data-access/queue-repository";

const logger = pino();

const TIMEOUT_DURATION = 1 * 60 * 1000; // 1 minute

const generateQueueName = (
  difficulty: Difficulty,
  category: string,
  language: Language,
) => {
  const difficultyString = difficulty.toString();
  const categoryString = category.toString();
  const languageString = language.toString();

  const matchName = difficultyString + categoryString + languageString;
  logger.debug(`Generated queue name: ${matchName}`);
  return matchName;
};

const generatePayload = (
  difficulty: Difficulty,
  category: string,
  language: Language,
) => {
  const roomId = uuidv4();
  const payload = {
    category: category.toString(),
    difficulty: difficulty.toString(),
    roomId,
    language: language.toString(),
  };

  logger.debug(`Generated payload: ${JSON.stringify(payload)}`);
  return payload;
};

const setMatchTimeout = (
  queueName: string,
  socketId: string,
  io: Server,
  socket: Socket,
) => {
  logger.debug(`Setting match timeout for socketId ${socketId}`);

  setTimeout(async () => {
    const channel = await getChannelInstance();
    const timedOutMessage = await getMessage(queueName, channel);

    if (timedOutMessage && timedOutMessage.content.toString() === socketId) {
      logger.warn(
        `No match found for ${socketId} within the timeout period. Removing from queue...`,
      );
      await channel.ack(timedOutMessage);
      io.to(socketId).emit(
        "error",
        "No match found within the timeout period.",
      );
      socket.disconnect();
    }
  }, TIMEOUT_DURATION);
};

const processExistingMatch = async (
  existingMessage,
  socketId,
  queueName,
  channel,
  io,
  socket,
  match: Match,
) => {
  const { difficulty, category, language } = match;
  const peerSocketId: any = existingMessage.content.toString();
  const peerSocket = io.sockets.sockets.get(peerSocketId);

  const peerSocketIsCurrentSocket = socketId === peerSocketId;
  const peerSocketIsDisconnected = !peerSocket || peerSocket.disconnected;

  if (peerSocketIsCurrentSocket) {
    logger.warn(`Socket ${socketId} is already in the queue: ${peerSocketId}`);
    io.emit(
      "error",
      "You should not be able to enter the queue twice, disconnecting...",
    );
    socket.disconnect();
    return;
  }

  if (peerSocketIsDisconnected) {
    logger.trace(
      `Peer socket ${peerSocketId} is disconnected. Removing from queue...`,
    );
    channel.ack(existingMessage);
    await sendMessage(queueName, socketId, channel);
    setMatchTimeout(queueName, socketId, io, socket);
    return;
  }

  logger.info(`Match found for ${socketId}: ${peerSocketId}`);

  const payload = generatePayload(difficulty, category.toString(), language);
  logger.debug("Generated payload", payload);

  io.to(socketId).emit("match", payload);
  io.to(peerSocketId).emit("match", payload);

  await channel.ack(existingMessage);

  socket.disconnect();
  peerSocket.disconnect();
};

export const findMatch = async (match: Match, io: Server, socket: Socket) => {
  const channel = await getChannelInstance();
  const { difficulty, category, language, socketId } = match;

  const queueName = generateQueueName(difficulty, category, language);
  const existingMessage = await getMessage(queueName, channel);
  if (existingMessage) {
    logger.debug(
      `Existing message found in queue ${queueName} for socketId ${socketId}`,
    );
    await processExistingMatch(
      existingMessage,
      socketId,
      queueName,
      channel,
      io,
      socket,
      match,
    );
  } else {
    logger.info(
      `No match found for ${socketId} in ${queueName}. Adding to queue...`,
    );
    await sendMessage(queueName, socketId, channel);
    setMatchTimeout(queueName, socketId, io, socket);
  }
  await channel.checkQueue(queueName).then((replies) => {
    logger.info(`Queue ${queueName} now has ${replies.messageCount} messages`);
  });
};
