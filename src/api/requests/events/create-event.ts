import { CreateEventDTO } from "@/api/dtos/create-event.dto"
import { Event } from "@/api/models/event"
import { AxiosInstance } from "axios"

export async function createEvent(api: AxiosInstance, dto: CreateEventDTO): Promise<Event> {
  const { data } = await api.post<Event>(`/events`, dto)
  return data
}
