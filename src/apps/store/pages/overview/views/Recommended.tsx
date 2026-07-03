import { placeholderImg } from "@/utils/constants";
import { Link } from "react-router";
import { usePublishedApps } from "../../../hooks/usePublishedApps";

export default function Recommended() {
	const { apps, isLoading } = usePublishedApps();
	const recommendations = apps.slice(1, 4);

	if (isLoading) {
		return (
			<section className="mb-9">
				<h2 className="mb-4 text-2xl font-semibold tracking-normal">
					Recommended for you
				</h2>
				<p className="text-sm text-[#6e6e73]">Loading recommendations...</p>
			</section>
		);
	}

	if (!recommendations.length) {
		return (
			<section className="mb-9">
				<h2 className="mb-4 text-2xl font-semibold tracking-normal">
					Recommended for you
				</h2>
				<p className="text-sm text-[#6e6e73]">No recommendations yet.</p>
			</section>
		);
	}

	return (
		<section className="mb-9">
			<div className="mb-4 flex items-center justify-between">
				<h2 className="text-2xl font-semibold tracking-normal">
					Recommended for you
				</h2>
				<Link
					to="/store/categories"
					className="text-sm font-semibold text-[#0071e3]"
				>
					Show all
				</Link>
			</div>

			<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
				{recommendations.map((app) => (
					<Link
						key={app.id}
						to={`/store/app/${app.id}`}
						className="overflow-hidden rounded-[18px] bg-white shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_38px_rgba(0,0,0,0.09)]"
					>
						<div className="h-36 bg-[#1d1d1f]">
							<img
								src={app.icon || placeholderImg}
								alt={app.name}
								width={240}
								height={144}
								className="h-full w-full object-cover"
							/>
						</div>
						<div className="flex items-center justify-between gap-3 p-4">
							<div className="min-w-0">
								<h3 className="truncate font-semibold text-[#1d1d1f]">
									{app.name}
								</h3>
								<p className="text-xs text-[#6e6e73]">{app.category}</p>
							</div>
							<span className="shrink-0 rounded-full bg-[#eef5ff] px-4 py-1.5 text-xs font-bold text-[#0071e3]">
								{app.price}
							</span>
						</div>
					</Link>
				))}
			</div>
		</section>
	);
}
