import type {
  History,
  HistoryFilter,
  HistoryWithoutId,
  UpdateHistory,
} from "../commons/types/history-types";
import { getPrismaClient } from "../commons/utils/prisma-client-factory";

export async function addHistory(
  newHistoryRequest: HistoryWithoutId,
): Promise<History> {
  const resultHistory = await getPrismaClient().history.create({
    data: { ...newHistoryRequest },
  });

  return resultHistory;
}

export async function getAllHistories(
  filter: HistoryFilter,
): Promise<History[]> {
  const { userId, questionId, start, end } = filter;

  const histories = await getPrismaClient().history.findMany({
    where: {
      ...(userId && { userId }), // Include in query only if defined
      ...(questionId && { questionId }), // Include in query only if defined
      ...(start && { timestamp: { gte: new Date(start) } }),
      ...(end && { timestamp: { lte: new Date(end) } }),
    },
  });
  return histories;
}

export async function getHistoryById(id: number): Promise<History | null> {
  const resultHistory = await getPrismaClient().history.findUnique({
    where: {
      id,
    },
  });
  return resultHistory;
}

export async function getHistoryByUserId(
  userId: number,
): Promise<History[] | null> {
  const prisma = getPrismaClient();

  try {
    const history = await prisma.history.findMany({
      where: {
        userId,
      },
    });
    return history;
  } catch (error) {
    console.error("Error fetching history:", error);
    return null;
  } finally {
    await prisma.$disconnect();
  }
}

export async function getHistoryByUserIdAndQuestionId(
  userId: number,
  questionId: string,
): Promise<History[] | null> {
  const prisma = getPrismaClient();

  try {
    const history = await prisma.history.findMany({
      where: {
        userId,
        questionId,
      },
    });
    return history;
  } catch (error) {
    console.error("Error fetching history:", error);
    return null;
  } finally {
    await prisma.$disconnect();
  }
}

export async function updateHistory(
  id: number,
  updateHistoryRequest: UpdateHistory,
): Promise<History> {
  const resultHistory = await getPrismaClient().history.update({
    where: { id },
    data: { ...updateHistoryRequest },
  });
  return resultHistory;
}

export async function deleteHistory(
  historyIdToDelete: number,
): Promise<History> {
  const deleteResult = await getPrismaClient().history.delete({
    where: {
      id: historyIdToDelete,
    },
  });
  return deleteResult;
}

export async function cleanupData(): Promise<any> {
  const deleteResult = await getPrismaClient().history.deleteMany();
  return deleteResult;
}
