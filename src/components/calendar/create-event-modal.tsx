import { Event } from "@/api/models/event"
import { Button } from "@/components/ui/button"
import {
  Dialog, DialogContent,
  DialogDescription, DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import dayjs, { Dayjs } from "dayjs"
import { useCallback, useEffect, useState } from "react"

type Props = {
  open: boolean
  handleClose: () => void
  event?: Event
  start: Dayjs
  end: Dayjs
  onSubmit: () => void
}

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CreateEventDTO } from "@/api/dtos/create-event.dto"
import { useAPI } from "@/hooks/useAPI"
import { createEvent } from "@/api/requests/events/create-event"
import { toUTC } from "@/utils/date"
import { toast } from "@/hooks/use-toast"
import { AxiosError } from "axios"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { createEventchema } from "./create-event.schema"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { User } from "@/api/models/users"
import { listUsers } from "@/api/requests/users/list-users"
import { setUsersToEvent } from "@/api/requests/events/set-users-to-event"
import { useAuthContext } from "@/context/auth-context/auth-context"
import { ScrollArea } from "../ui/scroll-area"


export type CreateEventValues = z.infer<typeof createEventchema>

export function CreateEventModal({ open, handleClose, start, end, onSubmit }: Props) {


  const [users, setUsers] = useState<User[]>([])
  const [usersSearch, setUsersSearch] = useState<string>("")
  const [selectedUsers, setSelectedUsers] = useState<User[]>([])

  const { userData } = useAuthContext()

  const api = useAPI()
  const form = useForm<CreateEventValues>({
    resolver: zodResolver(createEventchema),
    defaultValues: {
      name: "",
      description: "",
      startHours: start.hour().toString(),
      startMins: start.minute().toString(),
      endHours: end.hour().toString(),
      endMins: end.minute().toString(),
    },
  })

  function onClose() {
    form.reset()
    setSelectedUsers([])
    setUsersSearch("")
    handleClose()
  }

  function _onSubmit(data: CreateEventValues) {

    const run = async () => {
      const dto: CreateEventDTO = {
        name: data.name,
        description: data.description,
        start: toUTC(dayjs(start).hour(Number(data.startHours) + 3).minute(Number(data.startMins)).toDate()),
        end: toUTC(dayjs(end).hour(Number(data.endHours) + 3).minute(Number(data.endMins)).toDate()),
      }

      const eventCreated = await createEvent(api, dto)
      if (selectedUsers.length > 0) {
        const users = [...(eventCreated.users?.map(u => u.id) || []), ...selectedUsers.map(u => u.id)]
        await setUsersToEvent(api, eventCreated.id!, { users })
      }
      onSubmit()
      onClose()
      toast({
        title: "Event created",
        description: "Event has been created",
      })
    }

    run().catch(err => {
      if (err instanceof AxiosError) {
        toast({
          title: "Could not create event",
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
    if (start) {
      form.setValue("startHours", start.hour().toString())
      form.setValue("startMins", start.minute().toString())
    }
    if (end) {
      form.setValue("endHours", end.hour().toString())
      form.setValue("endMins", end.minute().toString())
    }
  }, [start, end])

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
    <Dialog open={open} onOpenChange={(v) => v === false && onClose()} modal={true} >
      <DialogContent className="sm:max-w-[425px] lg:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Create a new event</DialogTitle>
          <DialogDescription>
            Fill in your event details to create a new event
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(_onSubmit)} className="w-full">
            <ScrollArea className="h-[600px] w-full rounded-md border p-2 my-4">
              <div className="grid gap-4 py-4 px-2 font-sans w-full">
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
            <DialogFooter>
              <Button type="submit">Create</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog >
  )
}
