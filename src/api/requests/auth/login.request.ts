import { AxiosInstance } from "axios";
import { LoginRequestDTO, LoginResponseDTO } from "../../dtos/login.dtos";

export async function loginRequest(api: AxiosInstance, dto: LoginRequestDTO): Promise<LoginResponseDTO> {
	const { data } = await api.post<LoginResponseDTO>("/auth/login", dto)
	return data
}
