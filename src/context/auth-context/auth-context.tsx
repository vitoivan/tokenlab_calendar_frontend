import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { AuthContext, UserDataContext, UserJWTPayload } from "../types/auth-context";
import { LocalStorage } from "../../utils/localstorage";
import { loginRequest } from "@/api/requests/auth/login.request";
import { LS_ACCESS_TOKEN_KEY, LS_REFRESH_TOKEN_KEY } from "@/utils/constants";
import { decodeJWT } from "@/utils/jwt";
import { createAPIClient } from "@/utils/create-api-client";

type Props = {
	children: JSX.Element
}

const ctx = createContext<AuthContext>({} as any);

export function AuthProvider({ children }: Props) {

	const accessToken = LocalStorage.getString(LS_ACCESS_TOKEN_KEY)
	const jwtPayload = accessToken ? decodeJWT<UserJWTPayload>(accessToken) : null
	const userDataInitialValue = jwtPayload ? { id: jwtPayload.sub, email: jwtPayload.email, name: jwtPayload.name } : null

	const [userData, setUserData] = useState<UserDataContext | null>(userDataInitialValue);

	const logout = useCallback(() => {
		LocalStorage.delete(LS_ACCESS_TOKEN_KEY)
		LocalStorage.delete(LS_REFRESH_TOKEN_KEY)
		setUserData(null)
	}, [])


	const api = useMemo(() => createAPIClient(), [])

	const login = useCallback(async (email: string, password: string) => {
		const res = await loginRequest(api, { email, password })
		LocalStorage.setString(LS_ACCESS_TOKEN_KEY, res.accessToken)
		LocalStorage.setString(LS_REFRESH_TOKEN_KEY, res.refreshToken)

		const jwtPayload = decodeJWT<UserJWTPayload>(res.accessToken)
		setUserData({ id: jwtPayload.sub, email: jwtPayload.email, name: jwtPayload.name })
	}, [api])

	const contextValue = useMemo(() => {
		return {
			isLoggedIn: userData !== null,
			userData,
			logout,
			login
		} as AuthContext
	}, [userData, login, logout])


	return (
		<ctx.Provider value={contextValue}>
			{children}
		</ctx.Provider>
	);
}

export const useAuthContext = () => useContext(ctx)
