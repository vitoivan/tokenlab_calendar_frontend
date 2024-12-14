import { jwtDecode } from "jwt-decode";

export function decodeJWT<T = any>(jwt: string): T {
	const decoded = jwtDecode(jwt);
	return decoded as T
}
