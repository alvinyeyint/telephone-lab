import { PBXOperator, PhoneOperator } from "ys-webrtc-sdk-core";

interface InitLinkusCredentials {
	username: string;
	secret: string;
	pbxURL: string;
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
export async function initLinkus(
	credentials: InitLinkusCredentials,
	options: InitLinkusOptions = {},
) {
	const { username, secret, pbxURL } = credentials;
	if (username.length <= 0)
		throw new Error("InitLinkus: Username not provided username");
	if (secret.length <= 0)
		throw new Error("InitLinkus: Secret not provided " + secret);

	const { beforeStart, afterStart, onError } = options;
	const init = await import("ys-webrtc-sdk-core").then(({ init }) => init);

	init({
		pbxURL,
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
			alert("Linkus Sdk Error")
			throw new Error("LinkusSdkError");
		});
}
