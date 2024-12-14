import { z } from "zod"

export const loginFormSchema = z.object({
	email: z.string().email("invalid email"),
	password: z.string().min(6, "password too short"),
})
