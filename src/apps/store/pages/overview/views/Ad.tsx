import { Link } from "react-router";
import { usePublishedApps } from "../../../hooks/usePublishedApps";

export default function Ad() {
	const { apps, isLoading } = usePublishedApps();
	const spotlightApp =
		apps.find((app) => app.rawCategory.toLowerCase() === "games") ?? apps[0];

	if (isLoading) {
		return (
			<section className="overflow-hidden rounded-[20px] bg-white p-4 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)]">
				<p className="text-sm text-[#6e6e73]">Loading spotlight...</p>
			</section>
		);
	}

	if (!spotlightApp) {
		return null;
	}

	return (
		<section className="overflow-hidden rounded-[20px] bg-white shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)]">
			<div className="h-48 bg-[#fff4e8]">
				<img
					src={spotlightApp.icon}
					alt={spotlightApp.name}
					width={384}
					height={192}
					className="h-full w-full object-cover"
				/>
			</div>
			<div className="p-4">
				<p className="mb-1 text-xs font-semibold uppercase tracking-[0.08em] text-[#86868b]">
					App spotlight
				</p>
				<h3 className="mb-1 text-xl font-semibold">{spotlightApp.name}</h3>
				<p className="mb-4 text-sm text-[#6e6e73]">{spotlightApp.category}</p>
				<Link
					to={`/store/app/${spotlightApp.id}`}
					className="block w-full rounded-full bg-[#0071e3] py-2 text-center text-sm font-semibold text-white transition hover:bg-[#0077ed]"
				>
					{spotlightApp.price}
				</Link>
			</div>
		</section>
	);
}
