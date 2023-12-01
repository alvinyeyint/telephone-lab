import { Button } from "@/components/Base/Button";
import "@/styles/globals.css";
import { IconoirProvider } from "iconoir-react";
import type { AppProps } from "next/app";
import { Space_Mono } from "next/font/google";
import { useRouter } from "next/router";
import { ErrorBoundary } from "react-error-boundary";

const spaceMono = Space_Mono({ weight: ["400", "700"], subsets: ["latin"] });

export default function App({ Component, pageProps }: AppProps) {
	const router = useRouter();

	return (
		<ErrorBoundary
			fallback={
				<div className="grid h-screen w-screen place-items-center">
					<Button onClick={() => router.reload()}>Retry</Button>
				</div>
			}
		>
			<IconoirProvider
				iconProps={{
					strokeWidth: 2,
					width: "1.5em",
					height: "1.5em",
				}}
			>
				<div className={spaceMono.className}>
					<Component {...pageProps} />
				</div>
			</IconoirProvider>
		</ErrorBoundary>
	);
}
