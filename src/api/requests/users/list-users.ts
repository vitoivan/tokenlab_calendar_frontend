import { ListUserDTO, ListUserResponseDTO } from "@/api/dtos/list-user.dto"
import { AxiosInstance } from "axios"

export async function listUsers(api: AxiosInstance, params: ListUserDTO): Promise<ListUserResponseDTO> {
  const urlParams = new URLSearchParams()

  if (params.name) {
    urlParams.append("name", params.name)
  }
  if (params.email) {
    urlParams.append("email", params.email)
  }
  urlParams.append("page", params.page.toString())
  urlParams.append("limit", params.limit.toString())

  const { data } = await api.get<ListUserResponseDTO>(`/users?${urlParams.toString()}`)
  return data
}
