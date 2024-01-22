import { useState } from "react";

import {
	fetchTimelineData,
	UserInfo,
	MonthData,
	CustomError,
	fetchUserInfo,
} from "../timeline-data";
import UserInfoSection from "./UserInfoSection";
import Timeline from "./Timeline";

// {
// 	userInfoData &&
// 		("status" in userInfoData ? (
// 			<p>`Error! ${userInfoData.error.message}`</p>
// 		) : (
// 			<p>{JSON.stringify(userInfoData)}</p>
// 		));
// }
// {
// 	userInfoData &&
// 		timelineData &&
// 		("name" in userInfoData ? <p>JSON.stringify(timelineData)</p> : <p>No timeline data!</p>);
// }

export default function App() {
	const [username, setUsername] = useState<string>("");
	const [userInfoData, setUserInfoData] = useState<UserInfo | CustomError | null>(null);
	const [timelineData, setTimelineData] = useState<MonthData[] | CustomError[] | null>(null);

	const onButtonClick = async () => {
		const userResponse: UserInfo | CustomError = await fetchUserInfo(username);
		// Error.
		if ("status" in userResponse) {
			setUserInfoData(userResponse);
			return;
		}
		const timelineResponse: CustomError[] | MonthData[] = await fetchTimelineData(
			username,
			2023,
		);
		setTimelineData(timelineResponse);
	};

	const onUsernameChange = (event: any) => {
		setUsername(event.target.value);
	};

	return (
		<>
			{/* Entering username and year */}
			<div>
				<input
					type="text"
					name="username"
					placeholder="Enter a username"
					onChange={onUsernameChange}
				/>
				<button type="submit" onClick={onButtonClick}>
					Get Timeline!
				</button>
			</div>

			{/* Timeline */}
			{userInfoData && <UserInfoSection response={userInfoData} />}
			{timelineData && <Timeline response={timelineData} />}
		</>
	);
}
