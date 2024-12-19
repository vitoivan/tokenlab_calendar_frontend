import { Event } from "../models/event"

export type ListUserEventsResponse = Event[]

export type ListUserEventsParams = {
	start: Date
	end: Date
}


