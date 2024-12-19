import { refreshTokenRequest } from "@/api/requests/auth/refresh-token.request"
import { envConfig } from "@/config/env/env-config"
import { useAuthContext } from "@/context/auth-context/auth-context"
import { LS_ACCESS_TOKEN_KEY, LS_REFRESH_TOKEN_KEY } from "@/utils/constants"
import { LocalStorage } from "@/utils/localstorage"
import axios, { AxiosError } from "axios"
import { useMemo } from "react"

export const useAPI = () => {

  const { logout } = useAuthContext()

  const api = useMemo(() => {
    const env = envConfig()

    const instance = axios.create({
      baseURL: `${env.calendarAPIURL}/api`
    });

    instance.interceptors.request.use(config => {
      config.headers.set('Authorization', `Bearer ${LocalStorage.getString(LS_ACCESS_TOKEN_KEY) || ""}`)
      return config
    })


    instance.interceptors.response.use(
      response => response,
      async (error: AxiosError) => {
        const originalRequest = error.config!

        const responseData = error.response?.data as any

        if (error.response?.status === 401 && responseData.message.includes("token") && responseData.message.includes("refresh") === false) {
          try {
            const { accessToken, refreshToken } = await refreshTokenRequest(instance, LocalStorage.getString(LS_REFRESH_TOKEN_KEY) || "")
            LocalStorage.setString(LS_ACCESS_TOKEN_KEY, accessToken)
            LocalStorage.setString(LS_REFRESH_TOKEN_KEY, refreshToken)
            originalRequest.headers.set('Authorization', `Bearer ${accessToken}`)
            return await instance(originalRequest)
          } catch (err) {
            console.error(err)
            logout()
          }


        }

        return Promise.reject(error)
      },
    )

    return instance
  }, [])


  return api
}
