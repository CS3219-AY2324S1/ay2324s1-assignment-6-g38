import { ArrowUpDown } from "lucide-react";
import React from "react";

import type { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/DataTable";

import { CategoryBadge, type QuestionType } from "@/features/questions";
import type { History } from "@/features/users";

type HistoryColumn = QuestionType & { timestamp: Date };

export const historyColumn: ColumnDef<HistoryColumn>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "categories",
    header: "Categories",
    cell: ({ row }) => {
      const categories: string[] = row.getValue("categories");
      return (
        <div className="flex w-60 flex-row flex-wrap gap-x-2">
          <CategoryBadge categories={categories} />
        </div>
      );
    },
  },
  {
    accessorKey: "difficulty",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Difficulty
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    enableSorting: true,
    sortingFn: (rowA, rowB) => {
      const order: { [key: string]: number } = { Hard: 3, Medium: 2, Easy: 1 }; // Define the order for sorting
      const difficultyA = rowA.getValue("difficulty") as keyof typeof order;
      const difficultyB = rowB.getValue("difficulty") as keyof typeof order;
      return order[difficultyB] - order[difficultyA]; // Sort based on the defined order
    },
  },
  {
    accessorKey: "timestamp",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date Completed
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date: Date = new Date(row.getValue("timestamp"));
      const formattedDate = new Intl.DateTimeFormat("en-SG", {
        year: "numeric",
        month: "long",
        day: "2-digit",
      }).format(date);
      return <p>{formattedDate}</p>;
    },
    sortingFn: (rowA, rowB) => {
      // Convert ISO string to Date object
      const dateA = new Date(rowA.getValue("timestamp") as string);
      const dateB = new Date(rowB.getValue("timestamp") as string);
      // Compare the time values of the dates
      return dateA.getTime() - dateB.getTime();
    },
    enableSorting: true,
  },
];

interface HistoryTableProps {
  histories: History[];
}

function formatHistory(history: History): HistoryColumn {
  return {
    ...history.question,
    timestamp: history.timestamp,
  };
}

export const HistoryTable: React.FC<HistoryTableProps> = ({ histories }) => {
  return (
    <DataTable
      placeholder="Search by Title"
      filterBy="title"
      columns={historyColumn}
      data={histories.map((history) => formatHistory(history))}
    />
  );
};
