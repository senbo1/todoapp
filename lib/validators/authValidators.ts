import { z } from "zod";

export const RegisterSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6)
});

export const SignInSchema = z.object({
  email: z.string(),
  password: z.string()
});

export type RegisterPayload = z.infer<typeof RegisterSchema>; 
export type SignInPayload = z.infer<typeof SignInSchema>;