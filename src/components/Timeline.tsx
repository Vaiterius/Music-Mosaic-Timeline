import { TimelineData, MonthlyData } from "../interfaces-and-types";
import AlbumGrid from "./AlbumGrid";

/**
 * The vertical timeline sectioned by months of the given year
 */
export default function Timeline(props: { timeline: TimelineData; year: number }) {
	return (
		<div className="my-12">
			{props.timeline.map((monthlyData: MonthlyData, index: number) => (
				<div
					key={monthlyData.monthName}
					className={`flex ${index % 2 == 0 ? "" : "flex-row-reverse"}`}
				>
					{/* Empty space on other side of month section */}
					<div className="fake-timeline-item"></div>

					{/* Vertical timeline bar, round the top and bottom corners of the first and last item */}
					<div
						className={`mx-8 w-2 bg-primary shadow-xl ${index == 0 && "rounded-t-lg"} ${index == 11 && "rounded-b-lg"}`}
					></div>

					{/* Actual month item with the data */}
					<div className="flex flex-col">
						<h3
							className={`text-4xl font-bold text-primary ${index % 2 == 0 ? "self-start" : "self-end"}`}
						>
							{monthlyData.monthName}
						</h3>
						<hr className="border-t-1 m-2 bg-base-100" />
						<AlbumGrid albums={monthlyData.data} />
					</div>
				</div>
			))}
		</div>
	);
}
