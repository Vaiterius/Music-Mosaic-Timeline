import { AlbumData } from "../interfaces-and-types";

/**
 * The 4x4 grid of album pictures
 */
export default function AlbumGrid(props: { albums: AlbumData[] }) {
	return (
		<div className="album-grid flex flex-wrap">
			{props.albums.map((album) => (
				<div key={`${album.artist}-${album.name}`} className="w-1/4">
					{/* <p>{album.name}</p> */}
					{/* <p>{album.artist}</p> */}
					{/* <p>{album.scrobbles}</p> */}
					{/* <a href={album.url}>{album.url}</a> */}
					{album.imageUrl ? (
						<img
							className="m-0 h-24 w-24 rounded-lg p-0"
							src={album.imageUrl}
							alt={`${album.name} album by ${album.artist}`}
						/>
					) : (
						<div className="h-24 w-24">No album image</div>
					)}
				</div>
			))}
		</div>
	);
}
