import { ListUserEventsParams } from "@/api/dtos/list-user-events.dto"
import { Event } from "@/api/models/event"
import { AxiosInstance } from "axios"

export async function listUserEvents(api: AxiosInstance, userId: number, params: ListUserEventsParams): Promise<Event[]> {
  const urlParams = new URLSearchParams()
  urlParams.append("start", params.start.toISOString())
  urlParams.append("end", params.end.toISOString())
  const { data } = await api.get<Event[]>(`/users/${userId}/events?${urlParams.toString()}`)
  return data
}
