export type History = {
  id: number;
  userId: number;
  questionId: string;
  timestamp: Date;
  submittedCode: string;
};

export type HistoryFilter = {
  userId?: number;
  questionId?: string;
};

export type HistoryWithoutId = Omit<History, "id" | "timestamp">;

export type UpdateHistory = Partial<HistoryWithoutId>;
