import { ChevronLeft, Download, Share2, Star } from "lucide-react";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { placeholderImg } from "@/utils/constants";
import { Spin } from "antd";
import { Link, useNavigate, useParams } from "react-router";
import { useAppInstall } from "../../hooks/useAppInstall";
import { appStoreService } from "../../services/appStoreService";
import type { StoreApp } from "../../types/store";
import {
	formatAppPrice,
	formatCategoryLabel,
	transformAppRow,
} from "../../utils/storeHelpers";

type AppDetailView = {
	id: number;
	name: string;
	slug: string;
	developer: string;
	icon: string;
	category: string;
	subCategory?: string;
	rating: number;
	reviewCount: number;
	price: string;
	size: string;
	ageRating: string;
	version: string;
	lastUpdated: string;
	description: string;
	screenshots: string[];
	features: string[];
	relatedApps: StoreApp[];
	reviews: Array<{
		id: string;
		user: string;
		avatar: string;
		rating: number;
		date: string;
		content: string;
	}>;
};

const emptyApp: AppDetailView = {
	id: 0,
	name: "",
	slug: "",
	developer: "",
	icon: placeholderImg,
	category: "",
	subCategory: "",
	rating: 0,
	reviewCount: 0,
	price: "GET",
	size: "—",
	ageRating: "4+",
	version: "1.0.0",
	lastUpdated: "",
	description: "",
	screenshots: [],
	features: [],
	relatedApps: [],
	reviews: [],
};

export default function AppDetailPage() {
	const { id: appId } = useParams();
	const parsedAppId = appId ? Number(appId) : null;
	const numericAppId =
		parsedAppId && Number.isInteger(parsedAppId) ? parsedAppId : null;
	const [app, setApp] = useState<AppDetailView>(emptyApp);
	const [isLoading, setIsLoading] = useState(true);
	const [notFound, setNotFound] = useState(false);
	const { installApp, isInstalling, isInstalled } = useAppInstall(
		numericAppId ?? undefined
	);
	const navigate = useNavigate();

	useEffect(() => {
		fetchApp();
	}, [appId, isInstalling]);

	async function fetchApp() {
		if (!numericAppId) {
			setNotFound(true);
			setIsLoading(false);
			return;
		}

		setIsLoading(true);
		setNotFound(false);

		try {
			const [data, publishedApps] = await Promise.all([
				appStoreService.getAppDetails(numericAppId),
				appStoreService.getPublishedApps(),
			]);

			const storeApp = transformAppRow(data);
			const screenshots = (data.assets ?? [])
				.filter((asset) => asset.asset_type === "screenshot")
				.map((asset) => asset.file_path);
			const moderationReviews = data.reviews ?? [];
			const relatedApps = publishedApps
				.filter(
					(publishedApp) =>
						publishedApp.id !== numericAppId &&
						publishedApp.rawCategory === data.primary_category
				)
				.slice(0, 4);

			setApp({
				id: data.id,
				name: data.name,
				slug: data.slug,
				developer: storeApp.developer,
				icon: data.icon_url || placeholderImg,
				category: formatCategoryLabel(data.primary_category),
				subCategory: data.subcategory
					? formatCategoryLabel(data.subcategory)
					: undefined,
				rating: 0,
				reviewCount: moderationReviews.length,
				price: formatAppPrice(data),
				size: "—",
				ageRating: data.age_rating,
				version: "1.0.0",
				lastUpdated: new Date(data.updated_at).toLocaleDateString(),
				description: data.description,
				screenshots: screenshots.length ? screenshots : [data.icon_url],
				features: data.keywords?.length
					? data.keywords
					: ["Runs inside LineOS", "Optimized for iframe apps"],
				relatedApps,
				reviews: moderationReviews.map((review) => ({
					id: String(review.id),
					user: "App Review",
					avatar: placeholderImg,
					rating: review.status === "approved" ? 5 : 3,
					date: new Date(review.created_at).toLocaleDateString(),
					content: review.feedback || `Review status: ${review.status}`,
				})),
			});
		} catch (error) {
			console.error("Failed to fetch app details:", error);
			setNotFound(true);
		} finally {
			setIsLoading(false);
		}
	}

	if (isLoading) {
		return <div className="container max-w-7xl py-6">Loading...</div>;
	}

	if (notFound) {
		return (
			<div className="container max-w-7xl space-y-4 py-6">
				<Button variant="ghost" size="sm" asChild>
					<Link to="/store" className="flex items-center gap-1">
						<ChevronLeft className="h-4 w-4" />
						Back to Store
					</Link>
				</Button>
				<div className="rounded-lg bg-white p-8 text-center">
					<p className="text-muted-foreground">App not found.</p>
				</div>
			</div>
		);
	}

	return (
		<div className="container max-w-7xl p-6 space-y-8 bg-white rounded-lg">
			<div>
				<Button variant="ghost" size="sm" asChild>
					<Link to="/store" className="flex items-center gap-1">
						<ChevronLeft className="h-4 w-4" />
						Back to Store
					</Link>
				</Button>
			</div>

			<div className="flex flex-col md:flex-row gap-6">
				<div className="flex-shrink-0">
					<img
						src={app.icon || "/placeholder.svg"}
						alt={app.name}
						width={128}
						height={128}
						className="rounded-2xl shadow-md"
					/>
				</div>
				<div className="flex-grow space-y-3">
					<div>
						<h1 className="text-3xl font-bold">{app.name}</h1>
						<p className="text-muted-foreground">{app.developer}</p>
					</div>
					<div className="flex flex-wrap gap-2">
						<Badge variant="outline">{app.category}</Badge>
						{app.subCategory && (
							<Badge variant="outline">{app.subCategory}</Badge>
						)}
						<Badge variant="outline">{app.ageRating}</Badge>
					</div>
					{app.rating > 0 && (
						<div className="flex items-center gap-4">
							<div className="flex items-center">
								<div className="flex">
									{[...Array(5)].map((_, i) => (
										<Star
											key={i}
											className={`h-4 w-4 ${
												i < Math.floor(app.rating)
													? "fill-primary text-primary"
													: "fill-muted text-muted"
											}`}
										/>
									))}
								</div>
								<span className="ml-2 text-sm">
									{app.rating} ({app.reviewCount.toLocaleString()} reviews)
								</span>
							</div>
							<div className="text-sm text-muted-foreground">{app.size}</div>
						</div>
					)}
					<div className="flex flex-wrap gap-3 pt-2">
						{isInstalled ? (
							<Button
								className="gap-2"
								onClick={() => navigate(`/${app.slug}`)}
							>
								Open
							</Button>
						) : (
							<Button
								className="gap-2 btn-install"
								onClick={() => numericAppId && installApp(numericAppId)}
							>
								{isInstalling ? (
									<Spin
										percent="auto"
										size="small"
										style={{ color: "white" }}
										className="mr-0.5"
									/>
								) : (
									<Download className="h-4 w-4" />
								)}

								{app.price ?? "Get"}
							</Button>
						)}
						<Button variant="outline" size="icon">
							<Share2 className="h-4 w-4" />
						</Button>
					</div>
				</div>
			</div>

			<div className="space-y-4">
				<h2 className="text-xl font-semibold">Screenshots</h2>
				<div className="flex gap-4 overflow-x-auto pb-4 snap-x">
					{app.screenshots.map((screenshot, index) => (
						<div
							key={`${screenshot}-${index}`}
							className="flex-shrink-0 snap-center rounded-lg overflow-hidden"
						>
							<img
								src={screenshot || placeholderImg}
								alt={`${app.name} screenshot ${index + 1}`}
								width={800}
								height={400}
								className="h-[200px] md:h-[300px] w-auto object-cover"
							/>
						</div>
					))}
				</div>
			</div>

			<Tabs defaultValue="about" className="w-full">
				<TabsList className="grid w-full grid-cols-3 md:w-fit">
					<TabsTrigger value="about">About</TabsTrigger>
					<TabsTrigger value="reviews">Reviews</TabsTrigger>
					<TabsTrigger value="related">Related</TabsTrigger>
				</TabsList>
				<TabsContent value="about" className="space-y-6 pt-4">
					<div>
						<h3 className="text-lg font-semibold mb-2">Description</h3>
						<p className="whitespace-pre-line">{app.description}</p>
					</div>

					<div>
						<h3 className="text-lg font-semibold mb-2">Features</h3>
						<ul className="list-disc pl-5 space-y-1">
							{app.features.map((feature, index) => (
								<li key={index}>{feature}</li>
							))}
						</ul>
					</div>

					<div>
						<h3 className="text-lg font-semibold mb-2">Information</h3>
						<dl className="grid grid-cols-1 md:grid-cols-2 gap-2">
							<div className="flex">
								<dt className="w-32 font-medium">Developer</dt>
								<dd>{app.developer}</dd>
							</div>
							<div className="flex">
								<dt className="w-32 font-medium">Size</dt>
								<dd>{app.size}</dd>
							</div>
							<div className="flex">
								<dt className="w-32 font-medium">Category</dt>
								<dd>{app.category}</dd>
							</div>
							<div className="flex">
								<dt className="w-32 font-medium">Age Rating</dt>
								<dd>{app.ageRating}</dd>
							</div>
							<div className="flex">
								<dt className="w-32 font-medium">Version</dt>
								<dd>{app.version}</dd>
							</div>
							<div className="flex">
								<dt className="w-32 font-medium">Last Updated</dt>
								<dd>{app.lastUpdated}</dd>
							</div>
						</dl>
					</div>
				</TabsContent>

				<TabsContent value="reviews" className="space-y-6 pt-4">
					<div className="flex items-center justify-between">
						<h3 className="text-lg font-semibold">Ratings & Reviews</h3>
					</div>

					{app.reviews.length ? (
						<div className="flex flex-col md:flex-row gap-6 items-start">
							<div className="flex flex-col items-center p-4 border rounded-lg">
								<span className="text-4xl font-bold">{app.rating || "—"}</span>
								<span className="text-sm text-muted-foreground">
									{app.reviewCount.toLocaleString()} review notes
								</span>
							</div>

							<div className="flex-grow space-y-4">
								{app.reviews.map((review) => (
									<div
										key={review.id}
										className="border rounded-lg p-4 space-y-2"
									>
										<div className="flex items-center gap-2">
											<img
												src={review.avatar || "/placeholder.svg"}
												alt={review.user}
												width={40}
												height={40}
												className="rounded-full"
											/>
											<div>
												<p className="font-medium">{review.user}</p>
												<span className="text-xs text-muted-foreground">
													{review.date}
												</span>
											</div>
										</div>
										<p>{review.content}</p>
									</div>
								))}
							</div>
						</div>
					) : (
						<div className="rounded-lg border p-8 text-center text-muted-foreground">
							No reviews yet.
						</div>
					)}
				</TabsContent>

				<TabsContent value="related" className="pt-4">
					<h3 className="text-lg font-semibold mb-4">You May Also Like</h3>
					{app.relatedApps.length ? (
						<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
							{app.relatedApps.map((relatedApp) => (
								<Link
									to={`/store/app/${relatedApp.id}`}
									key={relatedApp.id}
									className="border rounded-lg p-4 hover:bg-accent transition-colors"
								>
									<div className="flex items-center gap-3">
										<img
											src={relatedApp.icon || "/placeholder.svg"}
											alt={relatedApp.name}
											width={60}
											height={60}
											className="rounded-xl"
										/>
										<div>
											<h4 className="font-medium">{relatedApp.name}</h4>
											<p className="text-sm text-muted-foreground">
												{relatedApp.category}
											</p>
										</div>
									</div>
								</Link>
							))}
						</div>
					) : (
						<div className="rounded-lg border p-8 text-center text-muted-foreground">
							No related apps yet.
						</div>
					)}
				</TabsContent>
			</Tabs>
		</div>
	);
}
