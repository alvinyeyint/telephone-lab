import { Phone, PhoneXmark } from "iconoir-react";
import { useState } from "react";
import { Button } from "./Base/Button";
import { Card } from "./Base/Card";
import { Title } from "./Base/Title";

type IncomingProps = {
	session: any;
	handler: () => void;
};
export default function Incoming(props: IncomingProps) {
	const { session, handler } = props;
	const [callInfo] = useState(session.status);
	const answerHandler = () => {
		session?.answer();
		handler();
	};
	const rejectHandler = () => {
		session?.reject();
		handler();
	};
	return (
		<Card>
			<Title size="md">Call Incoming</Title>
			<div>Avatar: {callInfo.avatar || "none"}</div>
			<div>Name: {callInfo.name}</div>
			<div>Number: {callInfo.number}</div>

			<div className="flex items-start gap-4">
				<article className="flex justify-end gap-4">
					<Button
						title="Reject Call"
						onClick={rejectHandler}
						className="bg-red-700 hover:bg-red-800"
					>
						<PhoneXmark />
					</Button>

					<Button
						title="Accept Call"
						onClick={answerHandler}
						className="bg-emerald-700 hover:bg-emerald-800"
					>
						<Phone />
					</Button>
				</article>
			</div>
		</Card>
	);
}
