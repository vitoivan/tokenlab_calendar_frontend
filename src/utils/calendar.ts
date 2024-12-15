import dayjs from "dayjs";

export const generateCalendarPage = (month = dayjs().month(), year = dayjs().year(), lines = 6) => {
	const firstDayOfMonth = dayjs().year(year).month(month).startOf("month");
	const lastDayOfMonth = dayjs().year(year).month(month).endOf("month");

	const dates: { date: dayjs.Dayjs; today: boolean; currentMonth: boolean }[] = []

	// generate prefix days
	for (let i = 0; i < firstDayOfMonth.day(); i++) {
		dates.push({
			date: firstDayOfMonth.day(i),
			today: false,
			currentMonth: false
		})
	}

	// generate current month days
	const today = dayjs()
	for (let i = firstDayOfMonth.date(); i <= lastDayOfMonth.date(); i++) {
		const date = firstDayOfMonth.date(i)
		dates.push({
			date: date,
			today: today.isSame(date),
			currentMonth: true
		})
	}


	// generate suffix days
	const remaining = (lines * 7) - dates.length
	for (let i = lastDayOfMonth.date() + 1; i <= lastDayOfMonth.date() + remaining; i++) {
		dates.push({
			date: dayjs().year(year).month(month).date(i),
			today: false,
			currentMonth: false
		})
	}

	return dates
}

