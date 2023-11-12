import pino from "pino";

const logger = pino();

export const assertNotAlreadyInQueue = (
  socket: string,
  otherSocket: string,
): boolean => {
  const notInQueue = socket !== otherSocket;
  if (!notInQueue) {
    logger.warn(`Socket ${socket} is already in the queue.`);
  }
  return notInQueue;
};
