import { Button } from "@/components/ui/button";
import { placeholderImg } from "@/utils/constants";
import { Sparkles } from "lucide-react";
import { Link } from "react-router";
import { usePublishedApps } from "../../../hooks/usePublishedApps";

export default function FeaturedApps() {
	const { apps, isLoading } = usePublishedApps();
	const featuredApp = apps[0];

	if (isLoading) {
		return (
			<section className="mb-9 flex min-h-[340px] items-center justify-center rounded-[22px] bg-white shadow-[0_18px_55px_rgba(0,0,0,0.08)]">
				<p className="text-sm text-[#6e6e73]">Loading featured app...</p>
			</section>
		);
	}

	if (!featuredApp) {
		return (
			<section className="mb-9 flex min-h-[340px] items-center justify-center rounded-[22px] bg-white px-8 text-center shadow-[0_18px_55px_rgba(0,0,0,0.08)]">
				<div>
					<h2 className="text-2xl font-semibold text-[#1d1d1f]">
						No featured apps yet
					</h2>
					<p className="mt-2 text-sm text-[#6e6e73]">
						Publish an app to see it featured here.
					</p>
				</div>
			</section>
		);
	}

	return (
		<section className="mb-9 overflow-hidden rounded-[22px] bg-white shadow-[0_18px_55px_rgba(0,0,0,0.08)]">
			<div className="relative min-h-[340px]">
				<img
					src={featuredApp.icon || placeholderImg}
					alt={featuredApp.name}
					width={800}
					height={300}
					className="absolute inset-0 h-full w-full object-cover"
				/>
				<div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
				<div className="relative flex min-h-[340px] max-w-xl flex-col justify-end p-8">
					<div className="mb-3 flex w-fit items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-white/85 backdrop-blur-md">
						<Sparkles className="h-3.5 w-3.5" />
						{featuredApp.category}
					</div>
					<h2 className="mb-2 text-4xl font-semibold leading-tight text-white">
						{featuredApp.name}
					</h2>
					<p className="mb-5 line-clamp-3 text-base leading-6 text-white/82">
						{featuredApp.description || featuredApp.subtitle}
					</p>
					<Button
						asChild
						className="h-9 w-24 rounded-full bg-[#0071e3] text-sm font-semibold text-white hover:bg-[#0077ed]"
					>
						<Link to={`/store/app/${featuredApp.id}`}>
							{featuredApp.price}
						</Link>
					</Button>
				</div>
			</div>
		</section>
	);
}
