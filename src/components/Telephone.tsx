import { cn } from "@/utils";
import {
	DataTransferBoth,
	Dialpad,
	MicrophoneMute,
	Phone,
	PhoneOutcome,
	PhonePaused,
	PhoneXmark,
	Shuffle,
} from "iconoir-react";
import { FormEvent, ReactNode, useCallback, useState } from "react";
import { Button } from "./Base/Button";
import { Card } from "./Base/Card";
import { Input } from "./Base/Input";
import { Title } from "./Base/Title";

// ////////////////////////////////////////
// DialPad
// ////////////////////////////////////////
interface DialPadProps {
	disabled?: boolean;
	onCall?: (phoneNumber: string) => void;
}
export function DialPad({ disabled = false, onCall }: DialPadProps) {
	const [phoneNumber, setPhoneNumber] = useState("");
	const [formError, setFormError] = useState<{
		phoneNumber: string;
		errors: string[];
	}>({ phoneNumber: "", errors: [] });

	function validatePhoneNumber(phoneNumber: string) {
		if (phoneNumber.length <= 0) {
			setFormError((e) => ({
				...e,
				phoneNumber: "Please enter phone number.",
			}));
			return;
		}

		const phoneNumberSchema = new RegExp("[A-z]+", "g");
		if (phoneNumberSchema.test(phoneNumber)) {
			setFormError((e) => ({
				...e,
				phoneNumber: "Invalid phone number.",
			}));
			return;
		}

		setFormError((e) => ({ ...e, phoneNumber: "" }));
	}

	return (
		<Card className="flex flex-col gap-4">
			<Title size="md">Call Outgoing</Title>

			<form
				onSubmit={(e) => {
					e.preventDefault();
					if (onCall) onCall(phoneNumber || "");
				}}
			>
				<fieldset disabled={disabled}>
					<Input
						type="tel"
						label="Enter Phone Number"
						name="phoneNumber"
						value={phoneNumber}
						onChange={(e) => setPhoneNumber(e.currentTarget.value)}
						error={formError.phoneNumber}
						onInput={(e) => validatePhoneNumber(e.currentTarget.value)}
						onBlur={(e) => validatePhoneNumber(e.currentTarget.value)}
						rightSlot={
							<Button title="Start Call" type="submit" className="ml-4">
								<PhoneOutcome />
							</Button>
						}
					/>
				</fieldset>
			</form>
		</Card>
	);
}

// ////////////////////////////////////////
// InProgress Call
// ////////////////////////////////////////
interface CallInProgressProps {
	title?: ReactNode;
	hidden?: boolean;
	callInfo?: ReactNode;
	disabledControls?: boolean;
	onMute?: () => void;
	onHold?: () => void;
	onHangup?: () => void;
	onBlindTransfer?: () => void;
	onAttendantTransfer?: () => void;
	onDTMF?: () => void;
}
type InputStatus = "" | "BlindTransfer" | "AttendantTransfer" | "DTMF";
export function CallInProgress({
	title,
	hidden = false,
	callInfo,
	disabledControls = false,
	onMute,
	onHold,
	onHangup,
	onBlindTransfer,
	onAttendantTransfer,
	onDTMF,
}: CallInProgressProps) {
	const [inputStatus, setInputStatus] = useState<InputStatus>("");
	const [number, setNumber] = useState("");

	const toggleInputStatus = useCallback(
		(status: InputStatus) => {
			if (inputStatus !== status) setInputStatus(status);
			else setInputStatus("");
		},
		[inputStatus],
	);

	const inputFormSubmit = useCallback(
		(e: FormEvent<HTMLFormElement>) => {
			e.preventDefault();
			switch (inputStatus) {
				case "AttendantTransfer":
					onAttendantTransfer && onAttendantTransfer();
					return;
				case "BlindTransfer":
					onBlindTransfer && onBlindTransfer();
					return;
				case "DTMF":
					onDTMF && onDTMF();
					return;
				default:
					return;
			}
		},
		[inputStatus, onAttendantTransfer, onBlindTransfer, onDTMF],
	);

	return (
		<Card className={cn("flex flex-col gap-4", hidden ? "hidden" : "")}>
			<Title size="md">{title}</Title>

			<fieldset disabled={disabledControls} className="flex flex-wrap gap-4">
				<Button
					title="Mute Mic"
					onClick={() => onMute && onMute()}
					className="bg-indigo-700 hover:bg-indigo-800"
				>
					Mute <MicrophoneMute />
				</Button>

				<Button
					title="Hold Call"
					onClick={() => onHold && onHold()}
					className="bg-slate-700 hover:bg-slate-800"
				>
					Hold <PhonePaused />
				</Button>

				<Button
					title="Blind Transfer"
					onClick={() => toggleInputStatus("BlindTransfer")}
					className="bg-yellow-500 hover:bg-yellow-600"
				>
					Blind Transfer <DataTransferBoth />
				</Button>

				<Button
					title="Attendant Transfer"
					onClick={() => toggleInputStatus("AttendantTransfer")}
					className="bg-emerald-500 hover:bg-emerald-600"
				>
					Attendant Transfer <Shuffle />
				</Button>

				<Button
					title="DTMF"
					onClick={() => toggleInputStatus("DTMF")}
					className="bg-rose-500 hover:bg-rose-600"
				>
					DTMF <Dialpad />
				</Button>

				<Button
					title="Hangup"
					onClick={() => onHangup && onHangup()}
					className="bg-red-700 hover:bg-red-800"
				>
					Hangup <PhoneXmark />
				</Button>
			</fieldset>

			{inputStatus.length > 0 && (
				<form className="flex items-end gap-4" onSubmit={inputFormSubmit}>
					<Input
						label={inputStatus}
						value={number}
						onChange={(e) => setNumber(e.currentTarget.value)}
					/>
					<Button type="submit">
						<PhoneOutcome />
					</Button>
				</form>
			)}

			<article className="font-mono text-sm">{callInfo}</article>
		</Card>
	);
}

// ////////////////////////////////////////
// Incoming Call
// ////////////////////////////////////////
interface IncomingCallProps {
	title?: string;
	callInfo?: ReactNode;
	onReject?: () => void;
	onAccept?: () => void;
}
export function IncomingCall({
	title,
	callInfo,
	onReject,
	onAccept,
}: IncomingCallProps) {
	return (
		<Card>
			<div className="flex items-start justify-between">
				<Title size="md" className="mb-4">
					{title}
				</Title>

				<article className="flex justify-end gap-4">
					<Button
						title="Reject Call"
						onClick={() => onReject && onReject()}
						className="bg-red-700 hover:bg-red-800"
					>
						<PhoneXmark />
					</Button>

					<Button
						title="Accept Call"
						onClick={() => onAccept && onAccept()}
						className="bg-emerald-700 hover:bg-emerald-800"
					>
						<Phone />
					</Button>
				</article>
			</div>

			<article className="font-mono text-sm">{callInfo}</article>
		</Card>
	);
}
