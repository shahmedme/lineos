import {
	AppConfig,
	DEFAULT_IFRAME_ALLOW,
	DEFAULT_IFRAME_SANDBOX,
} from "@/config/apps";

interface AppFrameProps {
	app: AppConfig;
}

export default function AppFrame({ app }: AppFrameProps) {
	if (!app.url) {
		return null;
	}

	return (
		<iframe
			src={app.url}
			className="w-full h-full border-0 rounded-[13px] overflow-hidden bg-white"
			title={app.name}
			allow={app.allow ?? DEFAULT_IFRAME_ALLOW}
			sandbox={app.sandbox?.trim() || DEFAULT_IFRAME_SANDBOX}
			referrerPolicy="no-referrer"
		/>
	);
}
