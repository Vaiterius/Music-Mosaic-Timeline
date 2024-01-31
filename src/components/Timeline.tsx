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
					className={`flex ${index % 2 == 0 ? "lg:flex-row-reverse" : ""}`}
				>
					{/* Empty space on other side of month section */}
					<div className="hidden w-80 md:w-96 lg:block"></div>

					{/* Vertical timeline bar, round the top and bottom corners of the first and last item */}
					<div
						className={`mx-8 hidden w-2 translate-x-1 bg-primary shadow-xl lg:block ${index == 0 && "rounded-t-lg"} ${index == 11 && "rounded-b-lg"}`}
					></div>

					{/* Actual month item with the data */}
					<div className="flex flex-col">
						<h3
							className={`self-center text-4xl font-bold text-primary ${index % 2 == 0 ? "lg:self-end" : "lg:self-start"}`}
						>
							{monthlyData.monthName}
						</h3>
						<hr className="border-t-1 m-2 bg-base-100" />

						{monthlyData.data.length > 0 ? (
							<AlbumGrid albums={monthlyData.data} />
						) : (
							<div
								className={`flex w-80 justify-center md:w-96 ${index % 2 == 0 ? "pr-2 lg:justify-end" : "pl-2 lg:justify-start"}`}
							>
								<p className="text-lg italic text-primary">No data</p>
							</div>
						)}
					</div>
				</div>
			))}
		</div>
	);
}
