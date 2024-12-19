import dayjs, { Dayjs } from "dayjs";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "../ui/button";
import { Months } from "@/utils/enums";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { Event } from "@/api/models/event";
import { CalendarEvent } from "./event";
import { cn } from "@/utils/tailwind-merge";
import { CreateEventModal } from "./create-event-modal";
import { useAuthContext } from "@/context/auth-context/auth-context";
import { useAPI } from "@/hooks/useAPI";
import { listUserEvents } from "@/api/requests/users/list-user-events";
import { EditEventModal } from "./edit-event-modal";

export function Calendar() {

  const { userData } = useAuthContext()

  const [month, setMonth] = useState(dayjs().month())
  const [year, setYear] = useState(dayjs().year())
  const [day, setDay] = useState(dayjs().day(0))
  const [createEventModal, setCreateEventModal] = useState<boolean>(false)
  const [defaultStartCreateEvent, setDefaultStartCreateEvent] = useState<Dayjs>(dayjs())
  const [defaultEndCreateEvent, setDefaultEndCreateEvent] = useState<Dayjs>(dayjs())
  const [events, setEvents] = useState<Event[]>([])

  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)

  const api = useAPI()

  const listEvents = useCallback(() => {
    listUserEvents(
      api,
      userData?.id || 0,
      {
        start: day.startOf("week").startOf("day").toDate(),
        end: day.endOf("week").endOf("day").toDate(),
      }
    ).then(data => {
      setEvents(data)
    })
  }, [userData, day, api])

  useEffect(() => {
    listEvents()
  }, [listEvents])



  const nextWeek = () => {
    const newWeek = day.add(7, "day")
    setYear(newWeek.year())
    setMonth(newWeek.month())
    setDay(newWeek)
  }

  const prevWeek = () => {
    const newWeek = day.subtract(7, "day")
    setYear(newWeek.year())
    setMonth(newWeek.month())
    setDay(newWeek)
  }

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const week = useMemo(() => {
    const start = dayjs(day).startOf("week")
    const today = dayjs()

    const week: { date: Dayjs; today: boolean }[] = []
    for (let i = 0; i <= 6; i++) {
      const newDay = start.add(i, "day")
      week.push({
        date: newDay,
        today: newDay.date() === today.date() && newDay.month() === today.month()
      })
    }
    return week
  }, [day])


  function handleCreateEvent(start: Dayjs, end: Dayjs) {
    setCreateEventModal(true)
    setDefaultStartCreateEvent(start)
    setDefaultEndCreateEvent(end)
  }

  function handleSelectEvent(event: Event) {
    setSelectedEvent(event)
  }

  const findEventsForRange = useCallback((events: Event[], startHour: Dayjs, endHour: Dayjs) => {
    return events.filter(event => {

      const eventStart = dayjs(event.start)
      const eventEnd = dayjs(event.end)


      const startInclusive = (eventStart.isAfter(startHour) || eventStart.isSame(startHour)) && eventStart.isBefore(endHour)
      const startBefore = eventStart.isBefore(startHour) || eventStart.isSame(startHour)
      const endIclusive = (eventEnd.isBefore(endHour) || eventEnd.isSame(endHour)) && eventEnd.isAfter(startHour)
      const endAfter = eventEnd.isAfter(endHour) || eventEnd.isSame(endHour)

      const startedBeforeButEndedThere = startBefore && endIclusive
      const startedBeforeButEndedAfter = startBefore && endAfter
      const startedInclusiveButEndedAfter = startInclusive && endAfter
      const startInclusiveAndEndInclusive = startInclusive && endIclusive

      return (startedBeforeButEndedThere || startedBeforeButEndedAfter || startedInclusiveButEndedAfter || startInclusiveAndEndInclusive)
    })
  }, [week])

  return (
    <div className="flex flex-col gap-4 px-2 xl:px-8 py-4">
      <div className="flex flex-col my-2 justify-center items-center min-w-[1200px]">
        <span className="text-4xl">{Months[month]}, {year}</span>
        <div className="flex gap-2">
          <Button onClick={prevWeek} variant="ghost" className="p-2 px-3 rounded-full"><ChevronLeft /></Button>
          <Button onClick={nextWeek} variant="ghost" className="p-2 px-3 rounded-full"><ChevronRight /></Button>
        </div>
      </div>
      <div className="w-full  min-w-[1200px] w-full">
        <table className="w-full border border-muted relative">
          <thead>
            <tr className="grid grid-cols-8 items-center my-2 static">
              <th className="p-1 flex items-center justify-center"><Clock /></th>
              {weekDays.map((day, i) => (
                <th key={day} className="p-1 flex flex-col items-center justify-center relative">
                  <div>{day}</div>
                  <div>{week[i]?.date?.format("DD")}</div>
                  {
                    week[i].today && (
                      <div className="absolute w-5 h-1 bg-foreground bottom-[-5px]"></div>
                    )
                  }
                </th>
              ))}
            </tr>
          </thead>
        </table>
      </div>
      <div className="flex-1 overflow-auto min-w-[1200px] w-full">
        <table className="w-full table-fixed">
          <tbody>
            {
              new Array(24).fill(0).map((_, i) => {
                return (
                  <tr className="grid grid-cols-8 my-0 h-[100px] w-full" key={i}>
                    <td className="text-center flex items-center justify-center">
                      {dayjs().year(year).month(month).date(day.date()).hour(i).minute(0).second(0).millisecond(0).format("HH:mm")}
                    </td>
                    {
                      week.map(weekDay => {
                        const startHour = dayjs(weekDay.date).hour(i).minute(0).second(0).millisecond(0)
                        const endHour = startHour.add(1, "hour")
                        const eventsFound = findEventsForRange(events, startHour, endHour)

                        return (
                          <td className="text-center border border-muted relative w-full" key={weekDay.date.toString()} onClick={() => handleCreateEvent(startHour, endHour)}>
                            {
                              eventsFound.length ? (
                                eventsFound.map((e, i) => (
                                  <div
                                    onClick={(clickEvt) => {
                                      clickEvt.stopPropagation()
                                      handleSelectEvent(e)
                                    }}
                                    className="cursor-pointer"
                                    key={i}>
                                    <CalendarEvent
                                      event={e}
                                      startHour={startHour}
                                      endHour={endHour}
                                      className={
                                        cn(
                                          dayjs(e.start).isAfter(dayjs(startHour).add(30, "minute")) && "top-[50%] h-[45%]",
                                        )} />
                                  </div>
                                ))
                              ) : (<></>)
                            }
                          </td>
                        )
                      })
                    }
                  </tr>
                )
              })
            }
          </tbody>
        </table>
      </div>
      <CreateEventModal
        open={defaultStartCreateEvent && defaultEndCreateEvent && createEventModal}
        onSubmit={() => listEvents()}
        handleClose={() => setCreateEventModal(false)}
        start={defaultStartCreateEvent}
        end={defaultEndCreateEvent}
      />
      <EditEventModal
        open={!!selectedEvent}
        onSubmit={() => listEvents()}
        handleClose={() => setSelectedEvent(null)}
        event={selectedEvent}
      />
    </div>
  )
}
