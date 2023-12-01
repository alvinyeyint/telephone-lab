import { Card } from "@/components/Base/Card";
import { Title } from "@/components/Base/Title";
import Incoming from "@/components/Incoming";
import Session from "@/components/Session";
import { DialPad } from "@/components/Telephone";
import { yeastar } from "@/credentials";
import { echo } from "@/utils";
import { initLinkus } from "@/utils/linkus-sdk";
import { GetYeastarSignature } from "@/utils/yeastar-handshake";
import { useEffect, useRef, useState } from "react";

export default function PageYeastar() {
	const signatureCount = useRef(0);
	const [signature, setSignature] = useState("");
	const [signatureError, setSignatureError] = useState("");
	const [phone, setPhone] = useState<any>(null);
	const [callId, setCallId] = useState<any>("");
	const [sessions, setSessions] = useState<any>([]);
	const [incomings, setIncoming] = useState<any>([]);
	const [cause, setCause] = useState<any>("");

	useEffect(() => {
		if (signatureCount.current > 0) return;

		signatureCount.current = 1;
		const signature = new GetYeastarSignature({
			AccessID: yeastar.AccessID,
			AccessKey: yeastar.AccessKey,
			apiUrl: yeastar.BaseURL,
			username: yeastar.Username,
		});
		signature
			.handshake()
			.then((result) => {
				if (result.errmsg === "SUCCESS") {
					setSignature(result.data.sign ?? "");
				}
				if (result.errmsg === "FAILURE") {
					setSignatureError(result.errcode.toString());
				}
			})
			.catch((err) => {
				console.error(err);
				alert(
					"Signature Handshake Error! Check developer console for more details.",
				);
			});
	}, []);

	useEffect(() => {
		if (signature.length <= 0) return;

		initLinkus(
			{ secret: signature, username: yeastar.Username },
			{
				phone_beforeStart(phone) {},
				phone_afterStart(phone, destroy) {
					console.log("phone", phone);
					setPhone(phone);
				},
			},
		);
	}, [signature]);

	useEffect(() => {
		if (!phone) return;
		// listen startSession event and show ui.
		const startSession = ({
			callId,
			session,
		}: {
			callId: any;
			session: any;
		}) => {
			setCallId(callId);
			setSessions(Array.from(phone.sessions.values()));
		};

		const deleteSession = ({ callId, cause }: { callId: any; cause: any }) => {
			// here can handle session deleted event.
			setCause(cause);
			setSessions(Array.from(phone.sessions.values()));
		};
		const incoming = ({ callId, session }: { callId: any; session: any }) => {
			// This example disabled call waiting, only handle one call.
			// So here just handle one incoming call.
			setIncoming([session]);
		};
		phone.on("startSession", startSession);
		phone.on("deleteSession", deleteSession);
		phone.on("incoming", incoming);
		return () => {
			phone.removeListener("startSession", startSession);
			phone.removeListener("deleteSession", deleteSession);
			phone.removeListener("incoming", incoming);
		};
	}, [phone]);

	const callHandler = (number: string) => {
		if (!phone || !number) return;
		phone.call(number);
		setCause("");
	};
	const deleteIncoming = () => {
		setIncoming([]);
	};

	return (
		<main className="mx-auto max-w-5xl p-8">
			<Title className="mb-16">Linkus SDK</Title>

			<Card className="relative mb-10 w-full max-w-none overflow-auto bg-slate-200">
				<Title
					size="md"
					className="sticky left-0 top-0 inline-block rounded bg-blue-700 px-2 text-slate-200"
				>
					Linkus State
				</Title>

				<pre className="mt-4">{echo({ signature, signatureError })}</pre>
			</Card>

			<article className="flex flex-col gap-10">
				<section>
					{incomings.map((session) => (
						<Incoming
							key={session.status.callId}
							session={session}
							handler={() => {
								deleteIncoming();
							}}
						/>
					))}
					{sessions.map((session) => {
						return <Session key={session.status.callId} session={session} />;
					})}
					{cause && <div> phone call end, Cause: {cause} </div>}
				</section>

				<section className="grid grid-cols-2 gap-6">
					<DialPad onCall={(number) => callHandler(number)} />
					{/* <CallInProgress
						onHangup={() => phone.hangup(callId)}
						onHold={() => phone.hold(callId)}
						callInfo={
							<pre>
								{echo({
									callId: callId,
									session: sessions?.status?.callStatus,
								})}
							</pre>
						}
					/> */}
				</section>

				{/* <section className="flex flex-col gap-4">
					<Title size="md">Calls Incoming</Title>

					<IncomingCall callInfo={<pre>{echo({ phNo: "testing" })}</pre>} />
				</section> */}
			</article>
		</main>
	);
}
