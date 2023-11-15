import { useEffect, useState } from "react";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";

import type { History } from "@/features/users";

type WeekRange = {
  startOfWeek: Date;
  endOfWeek: Date;
};

const getStartAndEndDateOfWeek = (date: Date = new Date()): WeekRange => {
  const currentDayOfWeek = date.getDay();
  const diffToMonday = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek;
  const startOfWeek = new Date(date);
  startOfWeek.setDate(date.getDate() + diffToMonday);
  startOfWeek.setHours(0, 0, 0, 0); // Set to the start of the day
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999); // Set to the end of the day
  return {
    startOfWeek,
    endOfWeek,
  };
};

const isHistoryItemWithinRange = (
  historyItem: History,
  start: Date,
  end: Date,
): boolean => {
  const timestamp = new Date(historyItem.timestamp);
  return timestamp >= start && timestamp <= end;
};

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

interface WeeklySummaryCardProps {
  history: History[];
}

export const WeeklySummaryCard: React.FC<WeeklySummaryCardProps> = ({
  history,
}) => {
  const dateRange = getStartAndEndDateOfWeek();
  const startDate = dateFormatter.format(dateRange.startOfWeek);
  const endDate = dateFormatter.format(dateRange.endOfWeek);

  const [historyCount, setHistoryCount] = useState(0);

  useEffect(() => {
    const filteredHistory = history.filter((x) =>
      isHistoryItemWithinRange(x, dateRange.startOfWeek, dateRange.endOfWeek),
    );
    setHistoryCount(filteredHistory.length);
  }, [history, dateRange.startOfWeek, dateRange.endOfWeek]);

  return (
    <Card className="flex min-w-[33%] gap-6">
      <CardHeader>
        <CardTitle>
          <p className="text-base font-normal tracking-tight">
            Recent Interviews
          </p>
        </CardTitle>
        <p className="text-2xl font-bold">{historyCount} Interviews</p>
        <div className="text-xs text-muted-foreground">
          {startDate} - {endDate}
        </div>
      </CardHeader>
    </Card>
  );
};
