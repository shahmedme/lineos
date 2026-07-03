export const PUBLISH_PREFILL_KEY = "lineos:publish-prefill";

export type PublishPrefill = {
	name: string;
	appUrl: string;
	icon: string;
};

export function setPublishPrefill(data: PublishPrefill) {
	sessionStorage.setItem(PUBLISH_PREFILL_KEY, JSON.stringify(data));
}

export function getPublishPrefill(): PublishPrefill | null {
	const raw = sessionStorage.getItem(PUBLISH_PREFILL_KEY);
	if (!raw) {
		return null;
	}

	try {
		return JSON.parse(raw) as PublishPrefill;
	} catch {
		return null;
	}
}

export function clearPublishPrefill() {
	sessionStorage.removeItem(PUBLISH_PREFILL_KEY);
}

export function getFaviconUrl(appUrl: string) {
	try {
		const { hostname } = new URL(appUrl);
		return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(hostname)}&sz=128`;
	} catch {
		return "";
	}
}

export function isUploadedAssetUrl(url: string) {
	return url.startsWith("/uploads/");
}
