import { useState } from "react";

import { fetchTimelineData, fetchUserInfo } from "../timeline-data";
import { TimelineData, UserInfo, CustomError } from "../interfaces-and-types";
import UserInfoSection from "./UserInfoSection";
import Timeline from "./Timeline";

export default function App() {
	const CURRENT_YEAR: number = new Date().getFullYear();
	const [searchInput, setSearchInput] = useState<{ username: string; year: number }>({
		username: "",
		year: 2023,
	});
	const [userInfoData, setUserInfoData] = useState<UserInfo | CustomError | null>(null);
	const [timelineData, setTimelineData] = useState<TimelineData | null>(null);
	const [loading, setLoading] = useState<boolean>(false);

	const onButtonClick = async () => {
		setLoading(true);
		const userResponse: UserInfo | CustomError = await fetchUserInfo(searchInput.username);
		// Only fetch album data after user exists and an error doesn't happen on initial API call.
		if ("status" in userResponse) {
			setUserInfoData(userResponse);
			setLoading(false);
			return;
		}
		const timelineResponse: TimelineData = await fetchTimelineData(
			searchInput.username,
			searchInput.year,
		);
		setUserInfoData(userResponse);
		setTimelineData(timelineResponse);
		setLoading(false);
	};

	const onUsernameChange = (event: any) => {
		setSearchInput((prevSearchInput) => ({
			...prevSearchInput,
			username: event.target.value,
		}));
	};
	const onYearChange = (event: any) => {
		// Prevent typing of out-of-range numbers.
		let year: number = event.target.value;
		if (year > CURRENT_YEAR) year = CURRENT_YEAR;
		if (year < 2002) year = 2002;
		event.target.value = year;
		setSearchInput((prevSearchInput) => ({
			...prevSearchInput,
			year: year,
		}));
	};

	return (
		<div className="font-barlow mt-4 flex flex-col items-center">
			{/* Entering username and year */}
			<div className="mb-4 flex flex-col items-center">
				<div className="m-4 flex flex-col text-primary">
					<div className="space-x-4 font-bold">
						<span className="text-6xl">Your</span>
						<input
							type="number"
							name="year"
							id="year"
							onChange={onYearChange}
							className="w-40 rounded-lg px-3 text-5xl text-secondary"
							defaultValue={CURRENT_YEAR - 1}
							min={2002}
							max={CURRENT_YEAR}
							step={1}
						/>
						<span className="text-6xl">Timeline</span>
					</div>
					<p className="-translate-y-2 self-end text-xl">
						with <span className="text-gray font-bold">Last.fm</span>
					</p>
				</div>

				<p className="mb-6 italic text-primary">
					A year in music taste with generated monthly 4x4 albums
				</p>

				<div className="text-xl">
					<input
						className="input input-bordered input-primary mr-4 w-72 bg-primary text-black placeholder:text-accent"
						type="text"
						name="username"
						id="username"
						placeholder="Enter a username"
						onChange={onUsernameChange}
					/>
					<button
						className="btn btn-secondary w-20 align-middle font-bold"
						type="submit"
						onClick={onButtonClick}
					>
						{loading ? (
							<span className="loading loading-bars loading-md"></span>
						) : (
							"Search"
						)}
					</button>
				</div>
			</div>

			{userInfoData && <UserInfoSection response={userInfoData} />}
			{timelineData && <Timeline timeline={timelineData} year={searchInput.year} />}
		</div>
	);
}
