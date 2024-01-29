import { UserInfo } from "../interfaces-and-types";

export default function UserInfoSection(props: { response: UserInfo }) {
	return <p className="hidden">{JSON.stringify(props.response)}</p>;
}
