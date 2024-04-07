import { PhoneOperator, Session } from "ys-webrtc-sdk-core";
import { create } from "zustand";
import { persist } from "zustand/middleware";

// ////////////////////////////////////////
// example usage
// ////////////////////////////////////////
export function useExampleUsageStore() {
	const count = useCounterStore((s) => s.count);
	const incCount = useCounterStore((s) => s.incCount);
}

// ////////////////////////////////////////
// Counter Store
// ////////////////////////////////////////
interface CounterStore {
	count: number;
	doubledCount: () => number;
	incCount: () => void;
	decCount: () => void;
}
export const useCounterStore = create<CounterStore>((set, get) => {
	return {
		count: 0,
		doubledCount: () => get().count * 2,
		incCount: () => set({ count: get().count + 1 }),
		decCount: () => set({ count: get().count - 1 }),
	};
});
export const usePersistCounterStore = create(
	persist<CounterStore>(
		(set, get) => {
			return {
				count: 0,
				doubledCount: () => get().count * 2,
				incCount: () => set({ count: get().count + 1 }),
				decCount: () => set({ count: get().count - 1 }),
			};
		},
		{
			name: "localStorage_key",
			// remove functions from saving to localStorage
			partialize: (state) =>
				Object.fromEntries(
					Object.entries(state).filter(([key]) => !["foo"].includes(key)),
				) as any,
		},
	),
);

// ////////////////////////////////////////
// Api Store
// ////////////////////////////////////////
interface ApiStore {
	data: object | null;
	fetch: (payload: any) => Promise<void>;
}
export const useApiStore = create<ApiStore>((set, get) => {
	return {
		data: null,
		fetch: async (payload) => {
			return await fetch("may api url", {
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			}).then((r) => r.json());
		},
	};
});

interface CallSessionStore {
	phone: PhoneOperator | null;
	setPhone: (phone: PhoneOperator | null) => void;
	callTransfer: boolean;
	setCallTransfer: (value: boolean) => void;
	sessions: Session[];
	setSessions: (sessions: Session[]) => void;
}
export const useCallSessionStore = create<CallSessionStore>((set, get) => {
	return {
		phone: null,
		setPhone: (phone) => set({ phone }),
		callTransfer: false,
		setCallTransfer: (value) => set({ callTransfer: value }),
		sessions: [],
		setSessions: (sessions) => set({ sessions }),
	};
});
