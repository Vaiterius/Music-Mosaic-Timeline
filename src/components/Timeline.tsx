import { CustomError, MonthData } from "../timeline-data";

export default function Timeline(props: { response: CustomError[] | MonthData[] }) {
	return (
		// What the fuck did I write lmao.
		<>
			{props.response.map((monthData, index) => (
				<div key={index}>
					{monthData[index] && (
						<div key={monthData[index].monthName}>
							<h1 className={"text-xl font-bold"}>{monthData[index].monthName}</h1>
							{monthData.map((albumInfo) => (
								<div key={albumInfo.data.albumName}>
									<p>Album name: {albumInfo.data.albumName}</p>
									<p>Artist: {albumInfo.data.artistName}</p>
									<p>Scrobbles: {albumInfo.data.scrobbles}</p>
								</div>
							))}
						</div>
					)}
				</div>
			))}
		</>
	);
}
