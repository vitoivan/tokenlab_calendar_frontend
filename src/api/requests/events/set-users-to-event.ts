import { SetUsersToEventDTO } from "@/api/dtos/set-users-to-event.dto"
import { Event } from "@/api/models/event"
import { AxiosInstance } from "axios"

export async function setUsersToEvent(api: AxiosInstance, id: number, dto: SetUsersToEventDTO): Promise<Event> {
  const { data } = await api.put<Event>(`/events/${id}/users`, dto)
  return data
}
