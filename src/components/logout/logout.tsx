import { useAuthContext } from "@/context/auth-context/auth-context"
import { useEffect } from "react"
import { withAuth } from "../auth/auth"

function LogoutComponent() {
	const { logout } = useAuthContext()

	useEffect(() => {
		logout()
	}, [logout])

	return <></>
}

export const Logout = withAuth(<LogoutComponent />)
