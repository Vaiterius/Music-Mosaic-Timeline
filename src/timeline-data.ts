/**
 * Related functions that handle fetching of timeline data.
 *
 * Author's note: You'll see that each month of the year must request extra 16 API calls in order to fetch each
 * album's image in a 4x4 grid. The response from get.weeklyalbumchart doesn't return the album url by default
 * for each album, annoyingly. Last.fm should really update their API.
 */
import axios from "axios";

export interface MonthTimestamps {
	month: string;
	startTimestamp: number;
	endTimestamp: number;
}

export interface UserInfo {
	name: string;
	url: string;
	image: string;
}

export interface CustomError {
	status: number;
	error: {
		// Format as specified in the docs.
		message: string;
		type: number;
	};
}

// Success on fetching data.
export interface MonthData {
	monthName: string;
	data: {
		albumName: string;
		artistName: string;
		// albumUrl: string;
		scrobbles: number;
	};
}

const BASE_URL: string = "https://ws.audioscrobbler.com/2.0";

/**
 * Get an array of the user's data for each month of the year.
 */
export async function fetchTimelineData(
	username: string,
	year: number,
): Promise<CustomError[] | MonthData[]> {
	const months: MonthTimestamps[] = getMonthlyUnixTimestamps(year);

	// Fetch the top albums for each month.
	const timelineData: CustomError[] | MonthData[] = await Promise.all(
		months.map(async (month) => {
			const response = await fetchMonthlyData(username, month);
			// Something went wrong with the request.
			if ("status" in response) {
				return response; // Pass forward custom error object.
			}

			// Get only up to 16 for the 4x4 grid.
			const NUMBER_ALBUMS_LIMIT: number = 16;
			const truncatedAlbums: any[] = response.weeklyalbumchart.album.slice(
				0,
				NUMBER_ALBUMS_LIMIT,
			);
			return truncatedAlbums.map((album) => ({
				monthName: month.month,
				data: {
					albumName: album.name,
					artistName: album.artist["#text"],
					scrobbles: album.playcount,
				},
			}));
		}),
	);
	return timelineData;
}

export async function fetchUserInfo(username: string): Promise<UserInfo | CustomError> {
	try {
		const response = await axios.get(BASE_URL, {
			params: {
				api_key: import.meta.env.VITE_API_KEY,
				method: "user.getinfo",
				user: username,
				format: "json",
			},
		});
		return {
			name: response.data.user.name,
			url: response.data.user.url,
			image: response.data.user.image[2], // Size large.
		};
	} catch (error: any) {
		console.error(`Error ocurred fetching info from user: ${username}`);
		return {
			status: error.response.data.status,
			error: {
				message: error.response.data.message,
				type: error.response.data.error,
			},
		};
	}
}

/**
 * Get all the top album data of a user for that month of the year.
 */
export async function fetchMonthlyData(
	username: string,
	month: MonthTimestamps,
): Promise<any | CustomError> {
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
			status: error.response.data.status,
			error: {
				message: error.response.data.message,
				type: error.response.data.error,
			},
		};
	}
}

/**
 * Get the images from each album on the grid.
 */
export async function fetchAlbumImage(artistName: string, albumName: string): Promise<any> {}

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
