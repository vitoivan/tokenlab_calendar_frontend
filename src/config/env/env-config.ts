type EnvConfig = {
	calendarAPIURL: string
}

export function envConfig(): EnvConfig {
  return {
    calendarAPIURL: import.meta.env.VITE_CALENDAR_API_URL || "http://localhost:3000",
  }
}
