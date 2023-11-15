import pino from "pino";
import type { Server, Socket } from "socket.io";
import { v4 as uuidv4 } from "uuid";

import type { Difficulty, Language, Match } from "../commons/types";
import {
  getChannelInstance,
  getMessage,
  sendMessage,
} from "../data-access/queue-repository";
import { getQuestion, getQuestionById } from "../services/question-service";

import {
  assertQuestionExists,
  assertQuestionExistsById,
} from "./match-validators";

const logger = pino();
const TIMEOUT_DURATION = 1 * 60 * 1000; // 1 minute

const generateQueueName = (
  language: Language,
  difficulty?: Difficulty,
  category?: string,
  questionId?: string,
) => {
  if (questionId) {
    return `${questionId}${language}`;
  }
  if (difficulty && category) {
    return `${difficulty}${category}${language}`;
  }
  throw new Error("Insufficient data to generate queue name");
};

const generatePayload = (language: Language, question: any) => {
  const roomId = uuidv4();
  const payload = { roomId, language: language.toString(), question };

  logger.info(`Generated payload: ${JSON.stringify(payload)}`);
  return payload;
};

const setMatchTimeout = (
  queueName: string,
  socketId: string,
  io: Server,
  socket: Socket,
) => {
  logger.info(`Setting match timeout for socketId ${socketId}`);

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

const disconnectWithError = (
  socket: Socket,
  io: Server,
  message: string,
  socketId: string,
) => {
  logger.error(message);
  io.to(socketId).emit("error", message);
  socket.disconnect();
};

const fetchQuestion = async (match: Match) => {
  const { difficulty, category, questionId } = match;

  if (questionId) {
    const response = await getQuestionById(questionId);
    if (!response || !response.ok) {
      throw new Error(`No question found for questionId: ${questionId}`);
    }
    // eslint-disable-next-line @typescript-eslint/return-await
    return await response.json();
  }
  if (difficulty && category) {
    const params = new URLSearchParams({
      difficulty: difficulty.toString(),
      categories: category.toString(),
      getOne: "true",
    });
    const response = await getQuestion(params);
    if (!response || !response.ok) {
      throw new Error(`No question found for params: ${params}`);
    }
    // eslint-disable-next-line @typescript-eslint/return-await
    return await response.json();
  }
  throw new Error("Missing required match parameters");
};

const processExistingMatch = async (
  existingMessage,
  queueName,
  channel,
  io,
  socket,
  match: Match,
) => {
  const { id: socketId } = socket;

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

  const questionData = await fetchQuestion(match);
  if (!questionData) return;

  const payload = generatePayload(match.language, questionData);
  logger.info("Generated payload", payload);

  io.to(socketId).emit("match", payload);
  io.to(peerSocketId).emit("match", payload);

  await channel.ack(existingMessage);

  socket.disconnect();
  peerSocket.disconnect();
};

export const findMatch = async (match: Match, io: Server, socket: Socket) => {
  const channel = await getChannelInstance();
  const { difficulty, category, language, questionId } = match;

  try {
    if (questionId) {
      await assertQuestionExistsById(questionId);
    } else if (difficulty && category) {
      await assertQuestionExists(difficulty.toString(), category);
    } else {
      throw new Error(
        "Either provide difficulty, category, language or questionId, language.",
      );
    }

    const queueName = generateQueueName(
      language,
      difficulty,
      category,
      questionId,
    );

    const existingMessage = await getMessage(queueName, channel);

    if (existingMessage) {
      await processExistingMatch(
        existingMessage,
        queueName,
        channel,
        io,
        socket,
        match,
      );
    } else {
      await sendMessage(queueName, socket.id, channel);
      setMatchTimeout(queueName, socket.id, io, socket);
    }
  } catch (error) {
    disconnectWithError(socket, io, error.message, socket.id);
  }
};
