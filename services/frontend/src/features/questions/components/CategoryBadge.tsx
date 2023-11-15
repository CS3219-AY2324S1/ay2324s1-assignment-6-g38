import React from "react";

import { Badge } from "@/components/ui/badge";

import { hashStringToColour } from "../utils/categoryStyles";

interface CategoryBadgeProps {
  categories: Array<string>;
}

export const CategoryBadge = ({ categories }: CategoryBadgeProps) => {
  return (
    <div className="flex gap-2">
      {categories.map((category) => (
        <div key={category}>
          <Badge className={`${hashStringToColour(category)} flex text-center`}>
            {category}
          </Badge>
        </div>
      ))}
    </div>
  );
};
