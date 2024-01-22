import { CustomError, UserInfo } from "../timeline-data";

export default function UserInfoSection(props: { response: CustomError | UserInfo }) {
	let hasError: boolean = "status" in props.response ? true : false;
	return (
		<div>
			{hasError ? (
				<p>{`Error ${props.response.status}! ${props.response.error.message}`}</p>
			) : (
				<p>{JSON.stringify(props.response)}</p>
			)}
		</div>
	);
}
