import { useAuthContext } from "@/context/auth-context/auth-context"
import { Routes } from "@/utils/enums"
import { Navigate } from "react-router-dom"

type Props = {
	children: JSX.Element
}

export function Auth({ children }: Props) {

  const { isLoggedIn } = useAuthContext()

  if (!isLoggedIn) {
    return <Navigate to={Routes.SIGN_IN} />
  }

  return children
}

export function withAuth(component: JSX.Element) {
  return <Auth>{component}</Auth>
}
