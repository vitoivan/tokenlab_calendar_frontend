import { User } from "../models/users"

export type ListUserDTO = {
	search?: string
	email?: string
	name?: string
	page: number
	limit: number
}

export type ListUserResponseDTO = {
	data: User[];
	page: number;
	totalPages: number;
	limit: number;
	totalRecords: number;
}

