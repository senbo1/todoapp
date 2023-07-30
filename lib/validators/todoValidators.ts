import { z } from "zod";

export const TodoSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
})

export type TodoPayload = z.infer<typeof TodoSchema>;