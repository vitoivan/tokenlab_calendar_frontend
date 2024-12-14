import { User } from "@/api/models/users"
import { AxiosInstance } from "axios"

export async function getUserById(api: AxiosInstance, id: number): Promise<User> {
	const { data } = await api.get<User>(`/users/${id}`)
	return data
}
