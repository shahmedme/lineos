import { useMemo } from "react";
import { Link, useSearchParams } from "react-router";
import { Star } from "lucide-react";
import { usePublishedApps } from "../../hooks/usePublishedApps";
import {
	getUniqueCategories,
	matchesCategoryFilter,
} from "../../utils/storeHelpers";

export default function CategoriesPage() {
	const { apps, isLoading } = usePublishedApps();
	const [searchParams] = useSearchParams();
	const selectedCategory = searchParams.get("category") ?? "all";
	const categories = useMemo(() => getUniqueCategories(apps), [apps]);
	const filteredApps = useMemo(
		() => apps.filter((app) => matchesCategoryFilter(app, selectedCategory)),
		[apps, selectedCategory]
	);

	if (isLoading) {
		return (
			<div className="p-6">
				<h1 className="mb-4 text-2xl font-bold">Categories</h1>
				<p className="text-sm text-[#6e6e73]">Loading categories...</p>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-bold">Categories</h1>
				<p className="mt-1 text-sm text-[#6e6e73]">
					Browse published apps by category.
				</p>
			</div>

			<div className="flex flex-wrap gap-2">
				<Link
					to="/store/categories"
					className={
						selectedCategory === "all"
							? "rounded-full bg-[#0071e3] px-4 py-2 text-sm font-semibold text-white"
							: "rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#424245] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)]"
					}
				>
					All ({apps.length})
				</Link>
				{categories.map((category) => (
					<Link
						key={category.value}
						to={`/store/categories?category=${encodeURIComponent(category.value)}`}
						className={
							selectedCategory === category.value
								? "rounded-full bg-[#0071e3] px-4 py-2 text-sm font-semibold text-white"
								: "rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#424245] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)]"
						}
					>
						{category.label} ({category.count})
					</Link>
				))}
			</div>

			{filteredApps.length ? (
				<div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
					{filteredApps.map((app) => (
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
						No published apps in this category yet.
					</p>
				</div>
			)}
		</div>
	);
}
