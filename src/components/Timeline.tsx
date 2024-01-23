import { TimelineData, MonthlyData } from "../interfaces-and-types";
import AlbumGrid from "./AlbumGrid";

/**
 * The vertical timeline sectioned by months of the given year
 */
export default function Timeline(props: { timeline: TimelineData; year: number }) {
	return (
		<div>
			<h2>{props.year}</h2>
			{props.timeline.map((monthlyData: MonthlyData) => (
				<div key={monthlyData.monthName}>
					<h3 className={"text-xl font-bold"}>{monthlyData.monthName}</h3>
					<AlbumGrid albums={monthlyData.data} />
				</div>
			))}
		</div>
	);
}
