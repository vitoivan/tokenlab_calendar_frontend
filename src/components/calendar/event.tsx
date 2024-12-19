import { Event } from "@/api/models/event";
import { cn } from "@/utils/tailwind-merge"
import dayjs, { Dayjs } from "dayjs"
import { Clock } from "lucide-react"
import { useMemo, useRef } from "react"


type Props = {
  event: Event
  className?: string
  startHour: Dayjs
  endHour: Dayjs
}


export function CalendarEvent({ event, className, endHour, startHour }: Props) {

  const start = dayjs(event.start)
  const end = dayjs(event.end)

  const el = useRef<HTMLDivElement>(null)

  const defaultEventClass = "p-1 absolute top-[4px] left-[4px] bg-primary text-primary-foreground mx-auto w-[96%] rounded-lg shadow-2xl h-[90%] z-20"


  const startIsSame = useMemo(() => startHour.isSame(start), [start, startHour])
  const startIsAfter30m = useMemo(() => startHour.isSame(start.subtract(30, 'minute')) || startHour.isBefore(start.subtract(30, 'minute')), [start, startHour])
  const endIsSame = useMemo(() => end.isSame(endHour), [end, endHour])
  const endIsBefore = useMemo(() => endHour.isBefore(end), [end, endHour])
  const endIsBefore30m = useMemo(() => {
    return (
      endHour.isAfter(end.subtract(30, 'minute')) || endHour.isSame(end.subtract(30, 'minute'))
    )
  }, [end, endHour])
  const endIsAfter30m = useMemo(() => {
    return (
      end.isAfter(end.subtract(30, 'minute')) && end.isBefore(endHour)
    )
  }, [end, endHour])

  if (startIsSame && endIsSame) {
    return (
      <div
        ref={el}
        className={cn(
          defaultEventClass,
          endHour.isBefore(end) && "h-[120%] z-10"
        )}>
        <h4 className="text-sm font-bold text-left ml-1">{event.name}</h4>
        <div className="absolute text-xs flex flex-col mt-2 items-end justify-end right-3 bottom-3">
          <div className="flex gap-1">
            <Clock size={16} />
            {start.format("HH:mm")} - {end.format("HH:mm")}
          </div>
        </div>
      </div>)
  } else if (startIsAfter30m && endIsSame) {
    return (
      <div
        ref={el}
        className={cn(
          defaultEventClass,
          "top-[40%] h-[55%]",
          endHour.isBefore(end) && "h-[120%] z-10"
        )}>
        <h4 className="text-sm font-bold text-left ml-1">{event.name}</h4>
        <div className="absolute text-xs flex flex-col mt-2 items-end justify-end right-3 bottom-3">
          <div className="flex gap-1">
            <Clock size={16} />
            {start.format("HH:mm")} - {end.format("HH:mm")}
          </div>
        </div>
      </div>)
  } else if (startIsSame) {
    return (
      <div
        ref={el}
        className={cn(
          defaultEventClass,
          endHour.isBefore(end) && "h-[120%] z-10"
        )}>
        <h4 className="text-sm font-bold text-left ml-1">{event.name}</h4>
      </div>)
  } else if (startIsAfter30m) {
    return (
      <div
        ref={el}
        className={cn(
          defaultEventClass,
          "top-[50%] h-[45%]",
          endHour.isBefore(end) && "h-[120%] z-10"
        )}>
        <h4 className="text-sm font-bold text-left ml-1">{event.name}</h4>
      </div>)
  } else if (endIsBefore) {
    return (
      <div
        ref={el}
        className={cn(
          defaultEventClass,
          "h-[120%] z-10",
          className,
        )}>
      </div>
    )
  } else if (endIsSame) {
    return (
      <div
        ref={el}
        className={cn(
          defaultEventClass,
          "h-[90%] z-20",
          className,
        )}>
        <div className="absolute text-xs flex flex-col mt-2 items-end justify-end right-3 bottom-3">
          <div className="flex gap-1">
            <Clock size={16} />
            {start.format("HH:mm")} - {end.format("HH:mm")}
          </div>
        </div>
      </div>
    )
  } else if (endIsBefore30m) {
    return (
      <div
        ref={el}
        className={cn(
          defaultEventClass,
          "bottom-[50%] h-[45%]",
          className,
        )}>
        <div className="absolute text-xs flex flex-col mt-2 items-end justify-end right-3 bottom-3">
          <div className="flex gap-1">
            <Clock size={16} />
            {start.format("HH:mm")} - {end.format("HH:mm")}
          </div>
        </div>
      </div>
    )
  } else if (endIsAfter30m) {
    return (
      <div
        ref={el}
        className={cn(
          defaultEventClass,
          "top-[50%] h-[45%]",
          className,
        )}>
        <div className="absolute text-xs flex flex-col mt-2 items-end justify-end right-3 bottom-3">
          <div className="flex gap-1">
            <Clock size={16} />
            {start.format("HH:mm")} - {end.format("HH:mm")}
          </div>
        </div>
      </div>
    )

  }
  else {
    return (
      <div
        ref={el}
        className={cn(
          defaultEventClass,
          endHour.isBefore(end) && "h-[120%] z-10"
        )}>
      </div>
    )
  }
}
