import { Container } from "@/components/container/container";
import { Button } from "@/components/ui/button";
import { Routes } from "@/utils/enums";
import { useNavigate } from "react-router-dom";

export function Page404() {

  const navigate = useNavigate()


  return (
    <Container>
      <div className="flex flex-col w-full min-h-screen justify-center items-center">
        <h1 className="text-2xl">404 - Page not found</h1>
        <p className="text-md text-muted-foreground">The page you are looking for does not exist.</p>
        <Button className="mt-4" onClick={() => navigate(Routes.HOME)}>Go Home</Button>
      </div>
    </Container>
  )
}
