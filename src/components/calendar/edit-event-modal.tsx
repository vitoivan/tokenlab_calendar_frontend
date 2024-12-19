import { Event } from "@/api/models/event"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription, DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import dayjs from "dayjs"
import { useEffect, useState } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useAPI } from "@/hooks/useAPI"
import { toUTC } from "@/utils/date"
import { toast } from "@/hooks/use-toast"
import { AxiosError } from "axios"
import { UpdateEventDTO } from "@/api/dtos/update-event.dto"
import { updateEvent } from "@/api/requests/events/update-event"
import { useForm } from "react-hook-form"
import { CreateEventValues } from "./create-event-modal"
import { createEventchema } from "./create-event.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { DeleteeEventModal } from "./delete-event-modal"

type Props = {
  open: boolean
  handleClose: () => void
  event?: Event | null
  onSubmit: () => void
}

export function EditEventModal({ open, handleClose, event, onSubmit }: Props) {

  const [selectedToDelete, setSelectedToDelete] = useState<Event | null>(null)

  const api = useAPI()

  const form = useForm<CreateEventValues>({
    resolver: zodResolver(createEventchema),
    defaultValues: {
      name: event?.name || "",
      description: event?.description || "",
      startHours: dayjs(event?.start).hour().toString(),
      startMins: dayjs(event?.start).minute().toString(),
      endHours: dayjs(event?.end).hour().toString(),
      endMins: dayjs(event?.end).minute().toString(),
    },
  })

  function onClose() {
    form.reset()
    handleClose()
  }

  useEffect(() => {
    if (event) {
      form.setValue("name", event?.name || "")
      form.setValue("description", event?.description || "")
      form.setValue("startHours", dayjs(event?.start).hour().toString())
      form.setValue("startMins", dayjs(event?.start).minute().toString())
      form.setValue("endHours", dayjs(event?.end).hour().toString())
      form.setValue("endMins", dayjs(event?.end).minute().toString())
    }
  }, [event])

  function _onSubmit(data: CreateEventValues) {
    const dto: UpdateEventDTO = {
      name: data.name,
      description: data.description,
      start: toUTC(dayjs(event!.start).hour(Number(data.startHours) + 3).minute(Number(data.startMins)).toDate()),
      end: toUTC(dayjs(event!.end).hour(Number(data.endHours) + 3).minute(Number(data.endMins)).toDate()),
    }

    updateEvent(api, event!.id, dto).then(() => {
      onSubmit()
      onClose()
      toast({
        title: "Event updated",
        description: "Event has been updated",
      })
    }).catch(err => {
      if (err instanceof AxiosError) {
        toast({
          title: "Could not update event",
          description: err.response?.data.message || "unkown error",
          variant: "destructive",
        })
      }
    })
  }


  return (
    <>
      <Dialog open={open} onOpenChange={(v) => v === false && onClose()} modal={true} >
        <DialogContent className="sm:max-w-[425px] lg:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Edit a event</DialogTitle>
            <DialogDescription>
              Fill in your event details to edit a event
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(_onSubmit)} className="w-full">
              <div className="grid gap-4 py-4 px-0 font-sans w-full">
                <div className="w-full">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">Event name</FormLabel>
                        <FormControl>
                          <Input placeholder="My event"  {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="w-full">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">Event description</FormLabel>
                        <FormControl>
                          <Input placeholder="some event ..."  {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="border border-muted p-3">
                  <h5 className="text-sm text-muted-foreground my-2">Start</h5>

                  <div className="flex gap-4 items-center">
                    <FormField
                      control={form.control}
                      name="startHours"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>hours</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value.toString().padStart(2, "0")}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select an hour" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {
                                Array.from({ length: 24 }).map((_, i) => (
                                  <SelectItem key={i} value={(i).toString().padStart(2, "0")}>
                                    {(i).toString().padStart(2, "0")}
                                  </SelectItem>
                                ))
                              }
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="startMins"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>minutes</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value.toString().padStart(2, "0")}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a minute" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {
                                Array.from({ length: 60 }).map((_, i) => (
                                  <SelectItem key={i} value={(i).toString().padStart(2, "0")}>
                                    {(i).toString().padStart(2, "0")}
                                  </SelectItem>
                                ))
                              }
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="border border-muted p-3">
                  <h5 className="text-sm text-muted-foreground my-2">End</h5>

                  <div className="flex gap-4 items-center">
                    <FormField
                      control={form.control}
                      name="endHours"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>hours</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value.toString().padStart(2, "0")}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select an hour" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {
                                Array.from({ length: 24 }).map((_, i) => (
                                  <SelectItem key={i} value={(i).toString().padStart(2, "0")}>
                                    {(i).toString().padStart(2, "0")}
                                  </SelectItem>
                                ))
                              }
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="endMins"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>minutes</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value.toString().padStart(2, "0")}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a minute" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {
                                Array.from({ length: 60 }).map((_, i) => (
                                  <SelectItem key={i} value={(i).toString().padStart(2, "0")}>
                                    {(i).toString().padStart(2, "0")}
                                  </SelectItem>
                                ))
                              }
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter className="flex justify-between gap-2">
                <Button type="button" variant="destructive" onClick={() => setSelectedToDelete(event!)}>Delete</Button>
                <Button type="submit">Edit</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog >
      <DeleteeEventModal
        handleClose={() => setSelectedToDelete(null)}
        event={selectedToDelete}
        open={!!selectedToDelete}
        onSubmit={() => {
          onSubmit()
          handleClose()
        }}
      />
    </>
  )
}
