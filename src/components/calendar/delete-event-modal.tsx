import { Event } from "@/api/models/event"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"


type Props = {
  open: boolean
  handleClose: () => void
  onSubmit: () => void
  event?: Event | null
}

import { useAPI } from "@/hooks/useAPI"
import { toast } from "@/hooks/use-toast"
import { AxiosError } from "axios"
import { deleteEvent } from "@/api/requests/events/delete-event"

export function DeleteeEventModal({ open, handleClose, onSubmit, event }: Props) {

  const api = useAPI()

  function onClose() {
    handleClose()
  }

  function _onSubmit() {
    deleteEvent(api, event!.id).then(() => {
      onSubmit()
      onClose()
      toast({
        title: "Event deleted",
        description: "Event has been deleted",
      })
    }).catch(err => {
      if (err instanceof AxiosError) {
        toast({
          title: "Could not delete event",
          description: err.response?.data.message || "unkown error",
          variant: "destructive",
        })
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={(v) => v === false && onClose()} modal={true} >
      <DialogContent className="sm:max-w-[425px] lg:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Delete event</DialogTitle>
          <DialogDescription>
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <h1>Are you sure ?</h1>
        <Button type="submit" variant={"destructive"} onClick={_onSubmit}>Confirm</Button>
      </DialogContent>
    </Dialog >
  )
}
