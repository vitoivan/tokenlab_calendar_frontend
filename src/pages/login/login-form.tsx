import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { loginFormSchema } from "./login-form.schema"

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
import { useMemo } from "react"
import { useNavigate } from "react-router-dom"


type LoginFormValues = z.infer<typeof loginFormSchema>

export function LoginForm() {

  const { login } = useAuthContext()

  const navigate = useNavigate()

  const schema = useMemo(() => loginFormSchema, [])
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  function onSubmit(values: LoginFormValues) {
    login(values.email, values.password).then(() => console.log("logged")).catch((e: AxiosError) => {
      const res = (e.response?.data) as any || null
      if (res.message === "invalid email or password") {
        form.setError("email", { message: "invalid email or password" })
        form.setError("password", { message: "invalid email or password" })
      }
    })
  }

  return (
    <Form {...form} >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
        <div>
          <div className="flex items-center">
						New to Tokenlab ?
            <Button
              variant="link"
              type="button"
              onClick={() => navigate("/signup")}
              className="m-0 p-0 text-sm mx-3 underline hover:no-underline">
							Create an account
            </Button>
          </div>

        </div>

        <Button type="submit">Sign in</Button>
      </form>
    </Form>
  )
}
