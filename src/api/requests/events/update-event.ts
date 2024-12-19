import { UpdateEventDTO } from "@/api/dtos/update-event.dto"
import { Event } from "@/api/models/event"
import { AxiosInstance } from "axios"

export async function updateEvent(api: AxiosInstance, id: number, dto: UpdateEventDTO): Promise<Event> {
  const { data } = await api.patch<Event>(`/events/${id}`, dto)
  return data
}
