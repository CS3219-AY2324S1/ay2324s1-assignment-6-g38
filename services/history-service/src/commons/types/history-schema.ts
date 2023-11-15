import { z } from "zod";

export const HistoryRecordSchema = z.object({
  id: z.number(),
  userId: z.number(),
  questionId: z.string(),
  timestamp: z.instanceof(Date).optional(),
  submittedCode: z.string(),
});

export const HistoryRecordWithoutIdAndTimestampSchema =
  HistoryRecordSchema.omit({
    id: true,
    timestamp: true,
  });

export const UpdateHistorySchema =
  HistoryRecordWithoutIdAndTimestampSchema.partial();

export const historyIdSchema = z.number();

export const DeleteHistorySchema = z.object({
  id: z.number().positive().int(),
});
