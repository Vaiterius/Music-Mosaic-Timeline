import { test, describe, expect } from "vitest";

import { getMonthlyUnixTimestamps, fetchMonthlyData, MonthTimestamps } from "../timeline-data";

const timestamps: MonthTimestamps[] = getMonthlyUnixTimestamps(2022);
// console.log(timestamps);

describe("Monthly timestamps", () => {
	test("Ensure 12 months", () => {
		expect(timestamps.length).toBe(12);
	});

	test("Ensure months are in order", () => {
		let monthNames: string[] = [
			"January",
			"February",
			"March",
			"April",
			"May",
			"June",
			"July",
			"August",
			"September",
			"October",
			"November",
			"December",
		];
		for (let i: number = 0; i < 12; i++) {
			expect(monthNames[i]).toBe(timestamps[i].month);
		}
	});
});

// For making sure returned number of albums can be truncated to 16.
describe("Truncating array size", () => {
	const limit: number = 10;
	const emptyItems: any[] = [];
	const below10Items: any[] = [1, 2, 3, 4, 5, 6, 7];
	const exactly10Items: any[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
	const over10Items: any[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

	test("Ensure empty array returns empty", () => {
		let sliced: any[] = emptyItems.slice(0, limit);
		// console.log(sliced);
		expect(sliced.length).toBe(0);
	});
	test("Ensure array with length below limit returns same length", () => {
		let sliced: any[] = below10Items.slice(0, limit);
		// console.log(sliced);
		expect(sliced.length).toBe(below10Items.length);
	});
	test("Ensure array with length same as limit returns same length", () => {
		let sliced: any[] = exactly10Items.slice(0, limit);
		// console.log(sliced);
		expect(sliced.length).toBe(exactly10Items.length);
	});
	test("Ensure array with length over limit return limit", () => {
		let sliced: any[] = over10Items.slice(0, limit);
		// console.log(sliced);
		expect(sliced.length).toBe(limit);
	});
});

describe("Fetching album data of a month", () => {
	let username: string = "vaiterius";
	test("Ensure data returned for existing user", async () => {
		const albumData = await fetchMonthlyData(username, timestamps[0]);
		console.log(albumData);
		expect(albumData.weeklyalbumchart.album.length).not.toBe(0);
	});

	test("Ensure 404 error for non-existing user", async () => {
		let username: string = "asdasdasdsdasd";
		try {
			// Will always throw error.
			const albumData = await fetchMonthlyData(username, timestamps[0]);
			// console.log(albumData);
		} catch (error: any) {
			expect(error.message).toBe("User not found");
			expect(error.error).toBe(6);
		}
	});

	test("Ensure data is null for months with no data", async () => {
		const albumData = await fetchMonthlyData(username, getMonthlyUnixTimestamps(2010)[0]);
		// console.log(albumData);
		expect(albumData.weeklyalbumchart.album.length).toBe(0);
	});
});
