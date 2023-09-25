import { z } from "zod";

// need to include "" as part of possibility Difficulty values due to shadcn bug with select
// see: https://github.com/shadcn-ui/ui/issues/549
const Difficulty = z.enum(["", "Easy", "Medium", "Hard"]);

const Question = z.object({
  title: z.string().nonempty({ message: "Title is required" }),
  categories: z
    .array(z.string())
    .nonempty({ message: "At least one category should be selected" }),
  difficulty: Difficulty,
  description: z.string().nonempty({ message: "Description is required" }),
  link: z.string().nonempty({ message: "Link is required" }),
});

export { Question };
