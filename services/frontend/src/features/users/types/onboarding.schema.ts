import * as z from "zod";

export const CreateUserSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Please use a name longer than 1 character",
    })
    .max(50, {
      message: "Please limit your name to within 50 characters",
    }),
  email: z.string().email({
    message: "Invalid email",
  }),
  url: z.union([z.literal(""), z.string().url({ message: "Invalid URL" })]),
  bio: z.union([
    z.literal(""),
    z
      .string()
      .max(300, { message: "Please limit your name to within 300 characters" }),
  ]),
});
