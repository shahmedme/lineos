import { useMemo, useState } from "react";
import { Link } from "react-router";
import { Star } from "lucide-react";
import { usePublishedApps } from "../../../hooks/usePublishedApps";
import {
	getUniqueCategories,
	matchesCategoryFilter,
} from "../../../utils/storeHelpers";

export default function TopApps() {
	const { apps, isLoading } = usePublishedApps();
	const [activeCategory, setActiveCategory] = useState("all");
	const categories = useMemo(() => getUniqueCategories(apps), [apps]);
	const filteredApps = useMemo(
		() => apps.filter((app) => matchesCategoryFilter(app, activeCategory)),
		[apps, activeCategory]
	);

	if (isLoading) {
		return (
			<div className="flex h-64 items-center justify-center">
				<div className="text-sm text-[#6e6e73]">Loading top apps...</div>
			</div>
		);
	}

	if (!apps.length) {
		return (
			<section className="mb-9 rounded-[20px] bg-white p-8 text-center shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)]">
				<h2 className="text-2xl font-semibold tracking-normal">
					Top Games & Apps
				</h2>
				<p className="mt-2 text-sm text-[#6e6e73]">
					No published apps are available yet.
				</p>
			</section>
		);
	}

	return (
		<section className="mb-9">
			<div className="mb-4 flex items-center justify-between">
				<h2 className="text-2xl font-semibold tracking-normal">
					Top Games & Apps
				</h2>
				<Link
					to="/store/categories"
					className="text-sm font-semibold text-[#0071e3]"
				>
					Show all
				</Link>
			</div>

			<div className="rounded-[20px] bg-white p-4 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)]">
				<div className="mb-4 flex space-x-2 overflow-x-auto">
					<button
						type="button"
						onClick={() => setActiveCategory("all")}
						className={
							activeCategory === "all"
								? "rounded-full bg-[#0071e3] px-4 py-2 text-sm font-semibold text-white"
								: "rounded-full bg-[#f5f5f7] px-4 py-2 text-sm font-semibold text-[#424245] hover:bg-black/[0.06]"
						}
					>
						All
					</button>
					{categories.map((category) => (
						<button
							key={category.value}
							type="button"
							onClick={() => setActiveCategory(category.value)}
							className={
								activeCategory === category.value
									? "rounded-full bg-[#0071e3] px-4 py-2 text-sm font-semibold text-white"
									: "rounded-full bg-[#f5f5f7] px-4 py-2 text-sm font-semibold text-[#424245] hover:bg-black/[0.06]"
							}
						>
							{category.label}
						</button>
					))}
				</div>

				{filteredApps.length ? (
					<div className="grid grid-cols-1 gap-2 md:grid-cols-2 2xl:grid-cols-3">
						{filteredApps.map((app, index) => (
							<Link
								key={app.id}
								to={`/store/app/${app.id}`}
								className="flex items-center gap-3 rounded-xl p-3 transition hover:bg-black/[0.035]"
							>
								<div className="relative">
									<div className="h-16 w-16 overflow-hidden rounded-[15px] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.08)]">
										<img
											src={app.icon}
											alt={app.name}
											width={64}
											height={64}
											className="h-full w-full object-cover"
										/>
									</div>
									<span className="absolute -left-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#1d1d1f] text-xs font-bold text-white">
										{index + 1}
									</span>
								</div>
								<div className="min-w-0 flex-1">
									<h3 className="truncate text-sm font-semibold text-[#1d1d1f]">
										{app.name}
									</h3>
									<div className="mb-1 truncate text-xs text-[#6e6e73]">
										{app.category}
									</div>
									{app.rating > 0 && (
										<div className="flex items-center text-xs text-[#6e6e73]">
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
					<p className="py-8 text-center text-sm text-[#6e6e73]">
						No apps found in this category.
					</p>
				)}
			</div>
		</section>
	);
}
