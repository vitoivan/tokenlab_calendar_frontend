import { AxiosInstance } from "axios";
import { LoginResponseDTO } from "../../dtos/login.dtos";

export async function refreshTokenRequest(api: AxiosInstance, refreshToken: string): Promise<LoginResponseDTO> {
	const { data } = await api.post<LoginResponseDTO>("/auth/token/refresh", { refreshToken })
	return data
}
