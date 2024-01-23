import { AlbumData } from "../interfaces-and-types";

/**
 * The 4x4 grid of album pictures
 */
export default function AlbumGrid(props: { albums: AlbumData[] }) {
	return (
		<div>
			{props.albums.map((album) => (
				<div key={`${album.artist}-${album.name}`}>
					<p>{album.name}</p>
					<p>{album.artist}</p>
					<p>{album.scrobbles}</p>
					<a href={album.url}>{album.url}</a>
					<img
						className="w-24"
						src={album.imageUrl}
						alt={`${album.name} album by ${album.artist}`}
					/>
				</div>
			))}
		</div>
	);
}
