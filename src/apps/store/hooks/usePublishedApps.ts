import { useEffect, useState } from "react";
import { appStoreService } from "../services/appStoreService";
import type { StoreApp } from "../types/store";

export function usePublishedApps() {
	const [apps, setApps] = useState<StoreApp[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let cancelled = false;

		async function loadApps() {
			try {
				const data = await appStoreService.getPublishedApps();
				if (!cancelled) {
					setApps(data);
				}
			} catch (loadError) {
				console.error("Failed to fetch published apps:", loadError);
				if (!cancelled) {
					setError("Failed to load apps");
				}
			} finally {
				if (!cancelled) {
					setIsLoading(false);
				}
			}
		}

		loadApps();

		return () => {
			cancelled = true;
		};
	}, []);

	return { apps, isLoading, error };
}
