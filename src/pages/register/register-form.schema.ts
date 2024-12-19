import { z } from "zod"

export const registerFormSchema = z.object({
  name: z.string().min(3, "name too short"),
  email: z.string().email("invalid email"),
  password: z.string().min(6, "password too short"),
})
