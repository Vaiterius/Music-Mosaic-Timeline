import { useState } from "react";

import { fetchTimelineData, MonthData } from "../timeline-data";

export default function App() {
	const [username, setUsername] = useState<string>("");
	const [timelineData, setTimelineData] = useState<MonthData[] | null>(null);

	const onButtonClick = async () => {
		const data: MonthData[] = await fetchTimelineData(username, 2023);
		setTimelineData(data);
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
				{/* <label htmlFor="year-select">Select the year</label>
				<select name="year-select" id="year-select" defaultValue={2023}>
					<option value={2023}></option>
				</select> */}
				<button type="submit" onClick={onButtonClick}>
					Click Me!
				</button>
			</div>

			{/* Timeline */}
			{timelineData ? JSON.stringify(timelineData) : "No data!"}
		</>
	);
}
