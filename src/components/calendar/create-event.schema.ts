import { z } from "zod"

export const createEventchema = z.object({
  name: z.string().min(3, "name too short"),
  description: z.string().min(1, "description too short"),
  startHours: z.string(),
  startMins: z.string(),
  endHours: z.string(),
  endMins: z.string(),
})
