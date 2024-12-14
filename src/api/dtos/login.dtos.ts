
export type LoginRequestDTO = {
	email: string
	password: string
}

export type LoginResponseDTO = {
	accessToken: string
	refreshToken: string
}
