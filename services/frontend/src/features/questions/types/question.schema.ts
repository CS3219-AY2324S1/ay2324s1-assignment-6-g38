import { z } from "zod";

// For resetting Select inputs, see: https://github.com/shadcn-ui/ui/issues/549#issuecomment-1703396297
const Difficulty = z
  .enum(["", "Easy", "Medium", "Hard"])
  .refine((value) => value !== "", {
    message: "Difficulty selection is required",
  });

const Question = z.object({
  title: z.string().nonempty({ message: "Title is required" }),
  categories: z
    .array(z.string())
    .nonempty({ message: "At least one category should be selected" }),
  difficulty: Difficulty,
  description: z.string().nonempty({ message: "Description is required" }),
  link: z.string().url().nonempty({ message: "Link is required" }),
});

export { Question };
