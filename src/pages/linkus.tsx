import { Title } from "@/components/Base/Title";
import { CallSetupUI, SignatureForm } from "@/components/CallSetup";

export default function LinkusPage() {
	return (
		<main className="mx-auto max-w-7xl p-8 pb-64">
			<Title className="mb-8">Linkus</Title>

			{/* Get Signature */}
			<SignatureForm />

			{/* CallSetupUI */}
			<CallSetupUI />
		</main>
	);
}
