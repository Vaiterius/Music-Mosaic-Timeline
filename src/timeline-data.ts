/**
 * Related functions that handle fetching of timeline data.
 *
 * Author's note: You'll see that each month of the year must request extra 16 API calls in order to fetch each
 * album's image for the 4x4 grid. The response from get.weeklyalbumchart doesn't return the album url by default
 * for each album, annoyingly. Last.fm should really update their API.
 */
import axios from "axios";
import { MonthTimestamps, UserInfo, CustomError, TimelineData } from "./interfaces-and-types";

const BASE_URL: string = "https://ws.audioscrobbler.com/2.0";

/**
 * Get an array of the user's data for each month of the year.
 */
export async function fetchTimelineData(username: string, year: number): Promise<TimelineData> {
	const timestamps: MonthTimestamps[] = getMonthlyUnixTimestamps(year);
	return await Promise.all(
		timestamps.map(async (monthTimestamps) => {
			const response = await fetchMonthlyData(username, monthTimestamps);
			// Allow only up to 16 albums for the 4x4 grid.
			const truncatedAlbums: any[] = response.weeklyalbumchart.album.slice(0, 16);

			// Fetch urls for each of those albums and insert them into the album data.
			const albumsWithUrls = await Promise.all(
				truncatedAlbums.map(async (album) => {
					const albumInfo = await fetchAlbumInfo(album.artist["#text"], album.name);
					return {
						name: album.name,
						artist: album.artist["#text"],
						url: albumInfo.album.url,
						imageUrl: albumInfo.album.image[2]["#text"], // Large.
						scrobbles: album.playcount,
					};
				}),
			);

			// MonthlyData.
			return {
				monthName: monthTimestamps.month,
				data: albumsWithUrls, // AlbumData.
			};
		}),
	);
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
			status: error.response.status,
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
			status: error.response.status,
			error: {
				message: error.response.data.message,
				type: error.response.data.error,
			},
		};
	}
}

/**
 * Get the info of an album.
 */
export async function fetchAlbumInfo(artistName: string, albumName: string): Promise<any> {
	try {
		const albumInfo = await axios.get(BASE_URL, {
			params: {
				api_key: import.meta.env.VITE_API_KEY,
				method: "album.getinfo",
				artist: artistName,
				album: albumName,
				format: "json",
			},
		});
		return albumInfo.data;
	} catch (error: any) {
		console.error(`Error ocurred fetching album data from the ${albumName} album`);
		return {
			status: error.response.status,
			error: {
				message: error.response.data.message,
				type: error.response.data.error,
			},
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
