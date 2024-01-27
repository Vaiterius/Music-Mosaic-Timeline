import { useState } from "react";

import { fetchTimelineData, fetchUserInfo } from "../timeline-data";
import { TimelineData, UserInfo, CustomError } from "../interfaces-and-types";
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
		<div className="mt-4 flex flex-col items-center">
			{/* Entering username and year */}
			<div className="mb-4 flex flex-col items-center">
				<div className="mb-4 space-x-4">
					<span className="text-6xl">Your</span>
					<select
						className="text-4xl"
						name="year"
						id="year"
						onChange={onYearChange}
						defaultValue={2023}
					>
						<option value={2020}>2020</option>
						<option value={2021}>2021</option>
						<option value={2022}>2022</option>
						<option value={2023}>2023</option>
						<option value={2024}>2024</option>
					</select>
					<span className="text-6xl">Timeline</span>
				</div>
				<div className="text-xl">
					<input
						className="input input-bordered mr-4"
						type="text"
						name="username"
						id="username"
						placeholder="Enter a username"
						onChange={onUsernameChange}
					/>
					<button className="btn btn-primary" type="submit" onClick={onButtonClick}>
						Generate
					</button>
				</div>
			</div>

			{userInfoData && <UserInfoSection response={userInfoData} />}
			{timelineData && <Timeline timeline={timelineData} year={searchInput.year} />}
		</div>
	);
}
