import { CreateUserDTO } from "@/api/dtos/create-user.dto"
import { User } from "@/api/models/users"
import { AxiosInstance } from "axios"

export async function createUser(api: AxiosInstance, dto: CreateUserDTO): Promise<User> {
  const { data } = await api.post<User>(`/users/`, dto)
  return data
}
