import { yeastar } from "@/credentials";
import { PBXOperator, PhoneOperator, init } from "ys-webrtc-sdk-core";

interface InitLinkusCredentials {
	username: string;
	secret: string;
}

interface InitLinkusOptions {
	beforeStart?: (
		phone: PhoneOperator,
		pbx: PBXOperator,
		destroy: () => void,
	) => void | Promise<void>;
	afterStart?: (
		phone: PhoneOperator,
		pbx: PBXOperator,
		destroy: () => void,
	) => void | Promise<void>;
	onError?: (error: unknown) => void | Promise<void>;
}

// ////////////////////////////////////////
// Linkus SDK Integration
// ////////////////////////////////////////
export function initLinkus(
	credentials: InitLinkusCredentials,
	options: InitLinkusOptions = {},
) {
	const { username, secret } = credentials;
	if (username.length <= 0)
		throw new Error("InitLinkus:", {
			cause: { msg: "Username not provided", username },
		});
	if (secret.length <= 0)
		throw new Error("InitLinkus:", {
			cause: { msg: "Secret not provided", secret },
		});

	const { beforeStart, afterStart, onError } = options;
	init({
		pbxURL: yeastar.BaseURL,
		username,
		secret,
	})
		.then((operator) => {
			const { phone, pbx, destroy } = operator;

			// Call before start hook
			if (beforeStart) beforeStart(phone, pbx, destroy);

			// Must start after listening for events
			// start registering the SIP UA.
			phone.start();

			// Call the after start hook
			if (afterStart) afterStart(phone, pbx, destroy);
		})
		.catch((err) => {
			if (onError) onError(err);
			throw new Error("LinkusSdkError:", { cause: err });
		});
}
