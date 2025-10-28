import { format } from "date-fns";

/**
 * Get the ordinal suffix for a day (st, nd, rd, th)
 */
function getOrdinalSuffix(day: number): string {
	if (day > 3 && day < 21) return "th";
	switch (day % 10) {
		case 1:
			return "st";
		case 2:
			return "nd";
		case 3:
			return "rd";
		default:
			return "th";
	}
}

/**
 * Format date according to project standards
 * @param date - The date to format
 * @returns Formatted date string (e.g., "1st Sep 2025")
 */
export function formatProjectDate(date: Date): string {
	const day = format(date, "d");
	const month = format(date, "MMM");
	const year = format(date, "yyyy");
	const ordinal = getOrdinalSuffix(Number(day));

	return `${day}${ordinal} ${month} ${year}`;
}
