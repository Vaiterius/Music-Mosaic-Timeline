import { AlbumData } from "../interfaces-and-types";

/**
 * The 4x4 grid of album pictures
 */
export default function AlbumGrid(props: { albums: AlbumData[] }) {
	// Rounding the corners of the album images.
	const getRoundedStyle = (index: number): string => {
		switch (index) {
			case 0:
				return "rounded-tl-lg";
			case 3:
				return "rounded-tr-lg";
			case 12:
				return "rounded-bl-lg";
			case 15:
				return "rounded-br-lg";
			default:
				return "";
		}
	};
	return (
		<div className="flex w-96 flex-wrap">
			{props.albums.map((album, index) => (
				<div
					key={`${album.artist}-${album.name}`}
					className="tooltip tooltip-primary w-1/4"
					data-tip={`Scrobbles: ${album.scrobbles}`}
				>
					{album.imageUrl ? (
						<a href={album.url} target="_blank">
							<img
								className={`${getRoundedStyle(index)} m-0 h-24 w-24 p-0`}
								src={album.imageUrl}
								alt={`${album.name} album by ${album.artist}`}
							/>
						</a>
					) : (
						<a href={album.url} target="_blank">
							<div className="h-24 w-24">No album image</div>
						</a>
					)}
				</div>
			))}
		</div>
	);
}
