import { Calendar } from "@/components/calendar/calendar";
import { Container } from "@/components/container/container";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/context/auth-context/auth-context";
import { LogOut } from "lucide-react";


export function HomePage() {

  const { logout } = useAuthContext()

  return (
    <Container>
      <div className="flex justify-end min-w-[1200px]">
        <Button
          onClick={() => logout()}
          type="button"
          variant="link"
        >
          <LogOut />
        </Button>
      </div>
      <Calendar />
    </Container>
  )
}
