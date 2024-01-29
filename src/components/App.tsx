import { useState } from "react";

import { fetchTimelineData, fetchUserInfo } from "../timeline-data";
import { TimelineData, UserInfo, CustomError } from "../interfaces-and-types";
import UserInfoSection from "./UserInfoSection";
import Timeline from "./Timeline";
import Footer from "./Footer";
import Alert from "./Alert";

export default function App() {
	const MIN_YEAR: number = 2002;
	const CURRENT_YEAR: number = new Date().getFullYear();
	const [searchInput, setSearchInput] = useState<{
		username: string;
		year: number;
	}>({
		username: "",
		year: CURRENT_YEAR - 1, // Start with last year.
	});
	const [userInfoData, setUserInfoData] = useState<UserInfo | CustomError | null>(null);
	const [timelineData, setTimelineData] = useState<TimelineData | null>(null);
	const [loading, setLoading] = useState<boolean>(false);

	// Fetching data from entered username.
	const onSearchClick = async (event: any) => {
		event.preventDefault();
		if (searchInput.username === "") return;
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

	// Called when going back or forth a year.
	const updateYearData = async (targetYear: number): Promise<null> => {
		setLoading(true);
		// Change display year.
		setSearchInput((prevSearchInput) => ({ ...prevSearchInput, year: targetYear }));
		let titleYear: any = document.querySelector("#year")!;
		titleYear.value = targetYear;
		// Fetch and update new data.
		const timelineResponse: TimelineData = await fetchTimelineData(
			searchInput.username,
			targetYear,
		);
		setTimelineData(timelineResponse);
		setLoading(false);
		return null;
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
		<div id="top" className="mt-4 flex flex-col items-center font-barlow">
			<div className="mb-4 flex flex-col items-center">
				{/* Website title */}
				<div className="m-4 flex flex-col text-primary">
					<div className="space-x-4 font-bold">
						<span className="text-6xl">Your</span>
						<input
							type="number"
							name="year"
							id="year"
							onChange={onYearChange}
							className="w-40 rounded-lg px-3 text-5xl text-secondary"
							defaultValue={searchInput.year}
							min={MIN_YEAR}
							max={CURRENT_YEAR}
							step={1}
						/>
						<span className="text-6xl">Timeline</span>
					</div>
					<p className="-translate-y-2 self-end text-xl">
						with <span className="text-gray font-bold">Last.fm</span>
					</p>
				</div>

				{/* Description */}
				<p className="mb-6 italic text-primary">
					A year in music taste with generated monthly 4x4 albums
				</p>

				{/* Username search */}
				<form className="text-xl drop-shadow-xl">
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
						onClick={onSearchClick}
					>
						{loading ? (
							<span className="loading loading-bars loading-md"></span>
						) : (
							"Search"
						)}
					</button>
				</form>
			</div>

			{/* User metadata after searching */}
			{userInfoData &&
				!loading &&
				("status" in userInfoData ? (
					<Alert response={userInfoData} />
				) : (
					<UserInfoSection response={userInfoData} />
				))}

			{/* Loading timeline data */}
			{loading && (
				<div className="m-8 mb-12 flex flex-col items-center text-xl font-bold">
					<p className="mb-4">Please wait</p>
					<progress className="progress progress-primary h-4 w-64"></progress>
				</div>
			)}

			{/* Actual timeline itself */}
			{timelineData && !loading && (
				<Timeline timeline={timelineData} year={searchInput.year} />
			)}

			{/* Backwards and forwards links */}
			{timelineData && !loading && (
				<div className="flex w-full justify-between text-primary">
					<button
						className={`btn-base-300 btn m-4 ${searchInput.year > MIN_YEAR ? "" : "invisible"}`}
						onClick={() => updateYearData(searchInput.year - 1)}
					>
						<a href="#top">← Back to {searchInput.year - 1}</a>
					</button>

					<a href="#top" className="btn-base-300 btn m-4">
						Go back up
					</a>

					<button
						className={`btn-base-300 btn m-4 ${searchInput.year < CURRENT_YEAR ? "" : "invisible"}`}
						onClick={() => updateYearData(+searchInput.year + +1)}
					>
						<a href="#top">
							{/* Had to do this - it wouldn't parse into integers for some reason? */}
							Go to {+searchInput.year + +1} →
						</a>
					</button>
				</div>
			)}

			{!timelineData && (
				<div className="flex h-full w-full items-center justify-center">
					<p>
						Don't have an account?
						<a
							target="_blank"
							href="https://www.last.fm/about"
							className="pl-1 font-bold hover:underline"
						>
							Sign up for Last.fm &#62;
						</a>
					</p>
				</div>
			)}
			<Footer hasData={timelineData !== null && !loading} />
		</div>
	);
}
