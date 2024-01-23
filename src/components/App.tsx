import { useState } from "react";

import { fetchTimelineData, fetchUserInfo } from "../timeline-data";
import { TimelineData, UserInfo, CustomError } from "../types";
import UserInfoSection from "./UserInfoSection";
import Timeline from "./Timeline";

export default function App() {
	const [searchInput, setSearchInput] = useState<{ username: string; year: number }>({
		username: "",
		year: 2023,
	});
	const [userInfoData, setUserInfoData] = useState<UserInfo | CustomError | null>(null);
	const [timelineData, setTimelineData] = useState<TimelineData | null>(null);

	const onButtonClick = async () => {
		const userResponse: UserInfo | CustomError = await fetchUserInfo(searchInput.username);
		// Only fetch album data after user exists and an error doesn't happen on initial API call.
		if ("status" in userResponse) {
			setUserInfoData(userResponse);
			return;
		}
		const timelineResponse: TimelineData = await fetchTimelineData(
			searchInput.username,
			searchInput.year,
		);
		setTimelineData(timelineResponse);
	};

	const onUsernameChange = (event: any) => {
		setSearchInput((prevSearchInput) => ({
			...prevSearchInput,
			username: event.target.value,
		}));
	};
	const onYearChange = (event: any) => {
		setSearchInput((prevSearchInput) => ({
			...prevSearchInput,
			year: event.target.value,
		}));
	};

	return (
		<>
			{/* Entering username and year */}
			<div>
				<label htmlFor="username">Enter a username: </label>
				<input
					type="text"
					name="username"
					id="username"
					placeholder="e.g. Vaiterius"
					onChange={onUsernameChange}
				/>
				<label htmlFor="year">Select a year: </label>
				<select name="year" id="year" onChange={onYearChange} defaultValue={2023}>
					<option value={2020}>2020</option>
					<option value={2021}>2021</option>
					<option value={2022}>2022</option>
					<option value={2023}>2023</option>
					<option value={2024}>2024</option>
				</select>
				<p>Selected year: {searchInput.year}</p>
				<button type="submit" onClick={onButtonClick}>
					Get Timeline!
				</button>
			</div>

			{userInfoData && <UserInfoSection response={userInfoData} />}
			{timelineData && <Timeline timeline={timelineData} year={searchInput.year} />}
		</>
	);
}
