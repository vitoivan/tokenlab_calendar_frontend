import { Container } from "@/components/container/container";
import { Navigate, useNavigate } from "react-router-dom";
import { Routes } from "@/utils/enums";
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useAuthContext } from "@/context/auth-context/auth-context"
import { AxiosError } from "axios"
import { useForm } from "react-hook-form";
import { registerFormSchema } from "./register-form.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { createUser } from "@/api/requests/users/create";
import { useAPI } from "@/hooks/useAPI";
import { toast } from "@/hooks/use-toast";
import { z } from "zod";

type RegisterFormValues = z.infer<typeof registerFormSchema>

export function RegisterPage() {

  const { isLoggedIn } = useAuthContext()

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  })

  const api = useAPI()
  const navigate = useNavigate()

  function onSubmit(values: RegisterFormValues) {
    createUser(api, values).then(() => {
      toast({ description: "Account successfully created" })
      navigate(Routes.SIGN_IN)
    }).catch((e: AxiosError) => {
      const data = e.response?.data as any
      const msg = data?.message as string || "Something went wrong"
      toast({ description: msg, variant: "destructive" })
    })
  }

  if (isLoggedIn) {
    return <Navigate to={Routes.HOME} />
  }

  return (
    <Container>
      <div className="flex flex-col items-center justify-center my-32 p-8">
        <h1 className="text-3xl tracking-widest font-light mb-8">Sign up</h1>
        <Form {...form} >
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full lg:w-[50%]">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Jhonny bravo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="test@email.com"  {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="*********" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Sign up</Button>
          </form>
        </Form>

      </div>
    </Container>
  )
}
