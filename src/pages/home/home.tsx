import { Container } from "@/components/container/container";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { useAuthContext } from "@/context/auth-context/auth-context";
import { generateCalendarPage } from "@/utils/calendar";
import { addDays } from "date-fns";
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";

export function HomePage() {

	const { logout } = useAuthContext()

	const now = new Date()
	const [date, setDate] = useState<DateRange | undefined>({
		from: now,
		to: addDays(now, 6),
	})

	useEffect(() => {
		console.log(generateCalendarPage(undefined, undefined, 5))
	}, [])

	return (
		<Container>
			<div className="flex justify-end mt-8">
				<Button onClick={() => logout()} type="button" >Logout</Button>
			</div>
			<Calendar
				mode="range"
				defaultMonth={date?.from}
				selected={date}
				onSelect={setDate}
				numberOfMonths={1}
			/>
		</Container>
	)
}
