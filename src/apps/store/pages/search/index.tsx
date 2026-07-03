import { Link, useSearchParams } from "react-router";
import { Star } from "lucide-react";
import { useMemo } from "react";
import { usePublishedApps } from "../../hooks/usePublishedApps";
import { filterStoreAppsByQuery } from "../../utils/storeHelpers";

export default function SearchPage() {
	const { apps, isLoading } = usePublishedApps();
	const [searchParams] = useSearchParams();
	const query = searchParams.get("q") ?? "";
	const results = useMemo(
		() => filterStoreAppsByQuery(apps, query),
		[apps, query]
	);

	if (isLoading) {
		return (
			<div className="space-y-4">
				<h2 className="text-2xl font-semibold">Search</h2>
				<p className="text-sm text-[#6e6e73]">Searching apps...</p>
			</div>
		);
	}

	if (!query.trim()) {
		return (
			<div className="rounded-2xl bg-white p-10 text-center shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)]">
				<p className="text-sm text-[#6e6e73]">
					Search for apps by name, category, or developer.
				</p>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div>
				<h2 className="text-2xl font-semibold">Search results</h2>
				<p className="mt-1 text-sm text-[#6e6e73]">
					{results.length} result{results.length === 1 ? "" : "s"} for "
					{query}"
				</p>
			</div>

			{results.length ? (
				<div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
					{results.map((app) => (
						<Link
							key={app.id}
							to={`/store/app/${app.id}`}
							className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)] transition hover:bg-black/[0.02]"
						>
							<img
								src={app.icon}
								alt={app.name}
								className="h-16 w-16 rounded-[15px] object-cover"
							/>
							<div className="min-w-0 flex-1">
								<h3 className="truncate font-semibold text-[#1d1d1f]">
									{app.name}
								</h3>
								<p className="truncate text-sm text-[#6e6e73]">
									{app.category}
								</p>
								{app.rating > 0 && (
									<div className="mt-1 flex items-center text-xs text-[#6e6e73]">
										<Star className="h-3 w-3 fill-[#ffcc00] text-[#ffcc00]" />
										<span className="ml-1">{app.rating}</span>
									</div>
								)}
							</div>
							<span className="rounded-full bg-[#eef5ff] px-3 py-1 text-xs font-bold text-[#0071e3]">
								{app.price}
							</span>
						</Link>
					))}
				</div>
			) : (
				<div className="rounded-2xl bg-white p-10 text-center shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)]">
					<p className="text-sm text-[#6e6e73]">
						No apps matched your search.
					</p>
				</div>
			)}
		</div>
	);
}
