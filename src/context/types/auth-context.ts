export type UserDataContext = {
	id: number;
	email: string;
	name: string;
}

export type AuthContext = {
	isLoggedIn: boolean;
	userData: UserDataContext | null;
	logout: () => void;
	login: (email: string, password: string) => Promise<void>
}

export type UserJWTPayload = {
	sub: number;
	email: string;
	name: string;
	exp: number;
	iat: number;
}
