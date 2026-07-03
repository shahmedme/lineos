import { Link } from "react-router";
import { usePublishedApps } from "../../../hooks/usePublishedApps";
import { sortAppsByRecent } from "../../../utils/storeHelpers";

export default function Trending() {
	const { apps, isLoading } = usePublishedApps();
	const trendingApps = sortAppsByRecent(apps).slice(0, 4);

	if (isLoading) {
		return (
			<section className="rounded-[20px] bg-white p-4 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)]">
				<h2 className="mb-4 text-lg font-semibold">Trending</h2>
				<p className="text-sm text-[#6e6e73]">Loading trending apps...</p>
			</section>
		);
	}

	if (!trendingApps.length) {
		return (
			<section className="rounded-[20px] bg-white p-4 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)]">
				<h2 className="mb-4 text-lg font-semibold">Trending</h2>
				<p className="text-sm text-[#6e6e73]">No trending apps yet.</p>
			</section>
		);
	}

	return (
		<section className="rounded-[20px] bg-white p-4 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)]">
			<div className="mb-4 flex items-center justify-between">
				<h2 className="text-lg font-semibold">Trending</h2>
				<Link
					to="/store/categories"
					className="text-sm font-semibold text-[#0071e3]"
				>
					Show all
				</Link>
			</div>

			<div className="divide-y divide-black/[0.06]">
				{trendingApps.map((app) => (
					<Link
						key={app.id}
						to={`/store/app/${app.id}`}
						className="flex items-center gap-3 py-3 first:pt-0"
					>
						<div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-[12px] bg-[#f5f5f7]">
							<img
								src={app.icon}
								alt={app.name}
								className="h-full w-full object-cover"
							/>
						</div>
						<div className="min-w-0 flex-1">
							<h3 className="truncate text-sm font-semibold text-[#1d1d1f]">
								{app.name}
							</h3>
							<p className="truncate text-xs text-[#6e6e73]">{app.category}</p>
						</div>
						<span className="rounded-full bg-[#eef5ff] px-3 py-1 text-xs font-bold text-[#0071e3]">
							{app.price}
						</span>
					</Link>
				))}
			</div>
		</section>
	);
}
