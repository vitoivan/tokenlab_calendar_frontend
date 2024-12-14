import { envConfig } from "@/config/env/env-config";
import axios from "axios";

export function createAPIClient() {
	const env = envConfig()

	return axios.create({
		baseURL: `${env.calendarAPIURL}/api`
	});
}
