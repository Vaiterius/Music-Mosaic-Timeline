/**
 * Related functions that handle fetching of timeline data.
 *
 * Author's note: I decided not to include a type interface for the data received from the Last.fm API as I've
 * heard the response data isn't always consistent and that the docs do not provide the return format.
 */
import axios from "axios";

export interface MonthTimestamps {
	month: string;
	startTimestamp: number;
	endTimestamp: number;
}

export interface MonthData {
	monthName: string;
	data: any;
}

const BASE_URL: string = "https://ws.audioscrobbler.com/2.0";

/**
 * Get an array of the user's data for each month of the year.
 */
export async function fetchTimelineData(username: string, year: number): Promise<MonthData[]> {
	let months: MonthTimestamps[] = getMonthlyUnixTimestamps(year);
	// Run 12 API calls in parallel.
	const monthlyData = await Promise.all(
		months.map(async (month) => {
			const response = await fetchMonthlyData(username, month);
			return {
				monthName: month.month,
				data: response,
			};
		}),
	);
	return monthlyData;
}

/**
 * Get the album data of a user given the username and month.
 */
export async function fetchMonthlyData(username: string, month: MonthTimestamps): Promise<any> {
	try {
		const response = await axios.get(BASE_URL, {
			params: {
				api_key: import.meta.env.VITE_API_KEY,
				method: "user.getweeklyalbumchart",
				user: username,
				from: month.startTimestamp,
				to: month.endTimestamp,
				format: "json",
			},
		});
		return response.data;
	} catch (error: any) {
		console.error(`Error ocurred fetching ${month.month} data: ${error}`);
		return {
			status: error.response.status,
			data: error.response.data,
		};
	}
}

/**
 * Get the starting and ending timestamp for each month of a given year.
 */
export function getMonthlyUnixTimestamps(year: number): MonthTimestamps[] {
	let timestamps: MonthTimestamps[] = [];

	for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
		// First day of the month, from first milisecond.
		const firstDay = new Date(year, monthIndex, 1, 0, 0, 0, 0);
		const startTimestamp = Math.floor(firstDay.getTime() / 1000);

		// Last day of the month, to last milisecond.
		const lastDay = new Date(year, monthIndex + 1, 0, 23, 59, 59, 999);
		const endTimestamp = Math.floor(lastDay.getTime() / 1000);

		timestamps.push({
			month: firstDay.toLocaleString("en-US", { month: "long" }),
			startTimestamp,
			endTimestamp,
		});
	}

	return timestamps;
}
