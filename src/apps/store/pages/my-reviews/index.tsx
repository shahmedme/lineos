import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
	Edit2,
	MessageSquare,
	Search,
	Star,
	ThumbsUp,
	Trash2,
} from "lucide-react";

type Review = {
	id: number;
	appName: string;
	appIcon: string;
	developer: string;
	category: string;
	rating: number;
	title: string;
	content: string;
	date: string;
	helpfulCount: number;
	hasDevResponse: boolean;
	devResponse?: string;
	devResponseDate?: string;
};

const reviews: Review[] = [];

function EmptyReviews() {
	return (
		<div className="rounded-xl border border-gray-200 bg-white p-10 text-center text-sm text-gray-500">
			You have not written any reviews yet.
		</div>
	);
}

export default function MyReviews() {
	return (
		<Tabs defaultValue="all" className="space-y-4">
			<div className="flex flex-col sm:flex-row justify-between gap-4">
				<TabsList className="grid grid-cols-4 w-full sm:w-auto sm:inline-flex">
					<TabsTrigger value="all">All Reviews</TabsTrigger>
					<TabsTrigger value="recent">Recent</TabsTrigger>
					<TabsTrigger value="helpful">Most Helpful</TabsTrigger>
					<TabsTrigger value="responses">With Responses</TabsTrigger>
				</TabsList>

				<div className="flex gap-2 items-center">
					<div className="relative flex-1">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
						<Input type="text" placeholder="Search reviews" className="pl-9" />
					</div>

					<Select defaultValue="date-desc">
						<SelectTrigger className="w-[180px]">
							<SelectValue placeholder="Sort by" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="date-desc">Newest First</SelectItem>
							<SelectItem value="date-asc">Oldest First</SelectItem>
							<SelectItem value="rating-desc">Highest Rating</SelectItem>
							<SelectItem value="rating-asc">Lowest Rating</SelectItem>
							<SelectItem value="helpful">Most Helpful</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>

			<TabsContent value="all" className="space-y-4">
				{reviews.length ? (
					reviews.map((review) => (
						<ReviewCard key={review.id} review={review} />
					))
				) : (
					<EmptyReviews />
				)}
			</TabsContent>

			<TabsContent value="recent" className="space-y-4">
				{reviews.length ? (
					reviews
						.sort(
							(a, b) =>
								new Date(b.date).getTime() - new Date(a.date).getTime()
						)
						.slice(0, 3)
						.map((review) => (
							<ReviewCard key={review.id} review={review} />
						))
				) : (
					<EmptyReviews />
				)}
			</TabsContent>

			<TabsContent value="helpful" className="space-y-4">
				{reviews.length ? (
					reviews
						.sort((a, b) => b.helpfulCount - a.helpfulCount)
						.map((review) => (
							<ReviewCard key={review.id} review={review} />
						))
				) : (
					<EmptyReviews />
				)}
			</TabsContent>

			<TabsContent value="responses" className="space-y-4">
				{reviews.length ? (
					reviews
						.filter((review) => review.hasDevResponse)
						.map((review) => (
							<ReviewCard key={review.id} review={review} />
						))
				) : (
					<EmptyReviews />
				)}
			</TabsContent>
		</Tabs>
	);
}

function ReviewCard({ review }: { review: Review }) {
	const formattedDate = new Date(review.date).toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});

	const formattedResponseDate = review.devResponseDate
		? new Date(review.devResponseDate).toLocaleDateString("en-US", {
				year: "numeric",
				month: "long",
				day: "numeric",
		  })
		: null;

	return (
		<div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
			<div className="p-4">
				<div className="flex gap-4">
					<div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
						<img
							src={review.appIcon || "/placeholder.svg"}
							alt={review.appName}
							width={48}
							height={48}
							className="w-full h-full object-cover"
						/>
					</div>

					<div className="flex-1 min-w-0">
						<div className="flex justify-between items-start">
							<div>
								<h3 className="font-medium text-lg">{review.appName}</h3>
								<p className="text-sm text-gray-500">{review.developer}</p>
							</div>
							<Badge variant="outline" className="text-xs font-normal">
								{review.category}
							</Badge>
						</div>
					</div>
				</div>

				<div className="mt-4">
					<div className="flex justify-between items-center mb-2">
						<div className="flex items-center gap-1">
							{[...Array(5)].map((_, i) => (
								<Star
									key={i}
									className={`h-4 w-4 ${
										i < review.rating
											? "text-yellow-400 fill-yellow-400"
											: "text-gray-300"
									}`}
								/>
							))}
						</div>
						<span className="text-sm text-gray-500">{formattedDate}</span>
					</div>

					<h4 className="font-medium mb-1">{review.title}</h4>
					<p className="text-gray-700 text-sm">{review.content}</p>

					<div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
						<div className="flex items-center gap-1">
							<ThumbsUp className="h-4 w-4" />
							<span>{review.helpfulCount} helpful</span>
						</div>

						<div className="flex gap-2">
							<Dialog>
								<DialogTrigger asChild>
									<Button
										variant="ghost"
										size="sm"
										className="h-8 px-2 text-blue-600"
									>
										<Edit2 className="h-3.5 w-3.5 mr-1" /> Edit
									</Button>
								</DialogTrigger>
								<DialogContent>
									<DialogHeader>
										<DialogTitle>Edit Your Review</DialogTitle>
										<DialogDescription>
											Update your review for {review.appName}
										</DialogDescription>
									</DialogHeader>
									<div className="grid gap-4 py-4">
										<div className="flex items-center gap-4">
											<img
												src={review.appIcon || "/placeholder.svg"}
												alt={review.appName}
												width={48}
												height={48}
												className="w-12 h-12 rounded-xl object-cover"
											/>
											<div>
												<h3 className="font-medium">{review.appName}</h3>
												<p className="text-sm text-gray-500">
													{review.developer}
												</p>
											</div>
										</div>
										<div>
											<div className="flex items-center gap-1 mb-2">
												{[...Array(5)].map((_, i) => (
													<button key={i} className="focus:outline-none">
														<Star
															className={`h-6 w-6 ${
																i < review.rating
																	? "text-yellow-400 fill-yellow-400"
																	: "text-gray-300"
															}`}
														/>
													</button>
												))}
											</div>
										</div>
										<div>
											<label htmlFor="title" className="text-sm font-medium">
												Title
											</label>
											<Input
												id="title"
												defaultValue={review.title}
												className="mt-1"
											/>
										</div>
										<div>
											<label htmlFor="review" className="text-sm font-medium">
												Review
											</label>
											<Textarea
												id="review"
												defaultValue={review.content}
												className="mt-1"
												rows={5}
											/>
										</div>
									</div>
									<DialogFooter>
										<Button variant="outline">Cancel</Button>
										<Button>Save Changes</Button>
									</DialogFooter>
								</DialogContent>
							</Dialog>

							<Dialog>
								<DialogTrigger asChild>
									<Button
										variant="ghost"
										size="sm"
										className="h-8 px-2 text-red-600"
									>
										<Trash2 className="h-3.5 w-3.5 mr-1" /> Delete
									</Button>
								</DialogTrigger>
								<DialogContent>
									<DialogHeader>
										<DialogTitle>Delete Review</DialogTitle>
										<DialogDescription>
											Are you sure you want to delete your review for{" "}
											{review.appName}? This action cannot be undone.
										</DialogDescription>
									</DialogHeader>
									<DialogFooter>
										<Button variant="outline">Cancel</Button>
										<Button variant="destructive">Delete Review</Button>
									</DialogFooter>
								</DialogContent>
							</Dialog>
						</div>
					</div>
				</div>

				{review.hasDevResponse && (
					<div className="mt-4 bg-gray-50 rounded-lg p-3">
						<div className="flex items-center gap-2 mb-2">
							<MessageSquare className="h-4 w-4 text-blue-600" />
							<h5 className="font-medium text-sm">Developer Response</h5>
							<span className="text-xs text-gray-500 ml-auto">
								{formattedResponseDate}
							</span>
						</div>
						<p className="text-sm text-gray-700">{review.devResponse}</p>
					</div>
				)}
			</div>
		</div>
	);
}
