import {
	BriefcaseBusiness,
	Code2,
	Gamepad2,
	Layers3,
	PenTool,
} from "lucide-react";
import { Link } from "react-router";
import { usePublishedApps } from "../../../hooks/usePublishedApps";
import { getUniqueCategories } from "../../../utils/storeHelpers";

const categoryIcons = [
	{ icon: Gamepad2, tint: "bg-[#eef5ff] text-[#0071e3]" },
	{ icon: PenTool, tint: "bg-[#f6f0ff] text-[#7d4cff]" },
	{ icon: Code2, tint: "bg-[#eaf8ef] text-[#248a3d]" },
	{ icon: BriefcaseBusiness, tint: "bg-[#fff4e8] text-[#bf5b00]" },
	{ icon: Layers3, tint: "bg-[#f5f5f7] text-[#424245]" },
];

export default function Categories() {
	const { apps, isLoading } = usePublishedApps();
	const categories = getUniqueCategories(apps);

	if (isLoading) {
		return (
			<section className="mb-9">
				<h2 className="mb-4 text-2xl font-semibold tracking-normal">
					Categories
				</h2>
				<p className="text-sm text-[#6e6e73]">Loading categories...</p>
			</section>
		);
	}

	if (!categories.length) {
		return (
			<section className="mb-9">
				<h2 className="mb-4 text-2xl font-semibold tracking-normal">
					Categories
				</h2>
				<p className="text-sm text-[#6e6e73]">No categories available yet.</p>
			</section>
		);
	}

	return (
		<section className="mb-9">
			<div className="mb-4 flex items-center justify-between">
				<h2 className="text-2xl font-semibold tracking-normal">Categories</h2>
				<Link
					to="/store/categories"
					className="text-sm font-semibold text-[#0071e3]"
				>
					Show all
				</Link>
			</div>

			<div className="grid grid-cols-2 gap-3 md:grid-cols-4">
				{categories.slice(0, 4).map(({ value, label, count }, index) => {
					const { icon: Icon, tint } =
						categoryIcons[index % categoryIcons.length];

					return (
						<Link
							key={value}
							to={`/store/categories?category=${encodeURIComponent(value)}`}
							className="flex items-center gap-3 rounded-2xl bg-white p-4 text-left shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_35px_rgba(0,0,0,0.08)]"
						>
							<span
								className={`flex h-11 w-11 items-center justify-center rounded-[12px] ${tint}`}
							>
								<Icon className="h-5 w-5" />
							</span>
							<span className="min-w-0">
								<span className="block text-sm font-semibold text-[#1d1d1f]">
									{label}
								</span>
								<span className="text-xs text-[#6e6e73]">{count} apps</span>
							</span>
						</Link>
					);
				})}
			</div>
		</section>
	);
}
