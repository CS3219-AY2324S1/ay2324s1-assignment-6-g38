import type { Socket } from "socket.io";

import type { Match } from "../../commons/types";
import { categories, Difficulty, Language } from "../../commons/types";

export const validateInput = async (
  msg: Match,
  socket: Socket,
): Promise<boolean> => {
  if (msg.questionId) {
    if (msg.language !== undefined && Language[msg.language] === undefined) {
      socket.emit("error", "Invalid Language!");
      return false;
    }
    return true;
  }

  if (
    msg.difficulty !== undefined &&
    Difficulty[msg.difficulty] === undefined
  ) {
    socket.emit("error", "Invalid Difficulty!");
    return false;
  }

  if (msg.category === undefined || !categories.has(msg.category)) {
    socket.emit("error", "Invalid Category!");
    return false;
  }

  if (msg.language !== undefined && Language[msg.language] === undefined) {
    socket.emit("error", "Invalid Language!");
    return false;
  }

  return true;
};
