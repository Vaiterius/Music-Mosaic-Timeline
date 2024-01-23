export interface MonthTimestamps {
	month: string;
	startTimestamp: number;
	endTimestamp: number;
}

export interface UserInfo {
	name: string;
	url: string;
	image: string;
}

export interface CustomError {
	status: number;
	error: {
		// Format as specified in the docs.
		message: string;
		type: number;
	};
}

export interface AlbumData {
	name: string;
	artist: string;
	url: string;
	imageUrl: string;
	scrobbles: number;
}

export interface MonthlyData {
	monthName: string;
	data: AlbumData[];
}

export type TimelineData = MonthlyData[];
