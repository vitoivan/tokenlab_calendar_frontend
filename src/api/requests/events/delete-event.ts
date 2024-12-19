import { Event } from "@/api/models/event"
import { AxiosInstance } from "axios"

export async function deleteEvent(api: AxiosInstance, id: number): Promise<Event> {
  const { data } = await api.delete<Event>(`/events/${id}`)
  return data
}
