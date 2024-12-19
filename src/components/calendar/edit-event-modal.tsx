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
import { useCallback, useEffect, useState } from "react"
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
import { useAuthContext } from "@/context/auth-context/auth-context"
import { User } from "@/api/models/users"
import { setUsersToEvent } from "@/api/requests/events/set-users-to-event"
import { listUsers } from "@/api/requests/users/list-users"
import { ScrollArea } from "../ui/scroll-area"

type Props = {
  open: boolean
  handleClose: () => void
  event?: Event | null
  onSubmit: () => void
}

export function EditEventModal({ open, handleClose, event, onSubmit }: Props) {

  const [users, setUsers] = useState<User[]>([])
  const [usersSearch, setUsersSearch] = useState<string>("")
  const [selectedUsers, setSelectedUsers] = useState<User[]>([])
  const { userData } = useAuthContext()

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
      setSelectedUsers(event?.users?.filter(u => u.id !== userData?.id) || [])
    }
  }, [event])




  function _onSubmit(data: CreateEventValues) {
    const run = async () => {
      const dto: UpdateEventDTO = {
        name: data.name,
        description: data.description,
        start: toUTC(dayjs(event!.start).hour(Number(data.startHours) + 3).minute(Number(data.startMins)).toDate()),
        end: toUTC(dayjs(event!.end).hour(Number(data.endHours) + 3).minute(Number(data.endMins)).toDate()),
      }

      const eventUpdated = await updateEvent(api, event!.id, dto)
      const _users = [event!.ownerId, ...selectedUsers.map(u => u.id)]
      await setUsersToEvent(api, eventUpdated.id!, { users: Array.from(new Set(_users)) })

      onSubmit()
      onClose()
      toast({
        title: "Event updated",
        description: "Event has been updated",
      })

    }

    run().catch(err => {
      if (err instanceof AxiosError) {
        toast({
          title: "Could not update event",
          description: err.response?.data.message || "unkown error",
          variant: "destructive",
        })
      }

    })
  }

  const getUsers = useCallback((search: string) => {
    listUsers(api, {
      page: 1,
      limit: 100,
      search,
    }).then(data => {
      setUsers([...data.data.filter(u => u.id !== userData!.id)])
    }).catch(err => {
      if (err instanceof AxiosError) {
        toast({
          title: "Could not fetch users",
          description: err.response?.data.message || "unkown error",
          variant: "destructive",
        })
      }
    })
  }, [api, userData])

  useEffect(() => {
    if (usersSearch.length >= 3) {
      getUsers(usersSearch)
    } else {
      setUsers([])
    }
  }, [usersSearch, getUsers])

  function handleSelectUser(user: User) {
    const index = selectedUsers.findIndex(u => u.id === user.id)
    if (index !== -1) {
      setSelectedUsers(selectedUsers.filter((_, i) => i !== index))
      return
    }
    setSelectedUsers([...selectedUsers, user])
    setUsersSearch("")
  }

  function handleRemoveUser(user: User) {
    setSelectedUsers(selectedUsers.filter(u => u.id !== user.id))
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
              <ScrollArea className="h-[600px] w-full rounded-md border p-2 my-4">
                <div className="grid gap-4 py-2 px-2 font-sans w-full">
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
                  <div className="w-full border border-muted p-2">
                    <h3 className="text-sm font-bold text-muted-foreground my-4">Invite users</h3>
                    <Input placeholder="users" value={usersSearch} onChange={(e) => setUsersSearch(e.target.value)} />

                    <div className="flex gap-2 mt-4 flex-wrap">
                      {
                        selectedUsers.map((user) => (
                          <div
                            className="bg-primary text-primary-foreground w-fit p-2 px-4 rounded-lg hover:cursor-pointer"
                            onClick={() => handleRemoveUser(user)}
                            key={user.id.toString() + user.email}>
                            {user.email}
                          </div>
                        ))
                      }
                    </div>
                    <div className="flex gap-2 mt-4 flex-wrap">
                      {
                        users
                          .map((user) => (
                            <div
                              key={user.id}
                              className="flex gap-4 items-center text-sm my-4 hover:cursor-pointer hover:bg-muted w-fit p-2 px-4 rounded-md"
                              onClick={() => {
                                handleSelectUser(user)
                              }}
                            >
                              {user.email}
                            </div>
                          ))
                      }
                    </div>
                  </div>
                </div>

              </ScrollArea>
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
