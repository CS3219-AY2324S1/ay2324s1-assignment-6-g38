import { formatDistanceToNow } from "date-fns";

export const renderRelativeTime = (date: Date) => {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};
