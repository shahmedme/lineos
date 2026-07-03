import type { App } from "@/types/database";
import type { StoreApp } from "../types/store";

export function formatCategoryLabel(category: string) {
	return category
		.split(/[-_\s]+/)
		.filter(Boolean)
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join(" ");
}

export function formatAppPrice(app: Pick<App, "pricing_model" | "price">) {
	if (app.pricing_model === "free") {
		return "GET";
	}

	if (app.price && app.price > 0) {
		return `$${app.price}`;
	}

	return "GET";
}

export function transformAppRow(
	app: App,
	overrides: Partial<StoreApp> = {}
): StoreApp {
	const developer = app.contact_email
		? app.contact_email.split("@")[0].replace(/[._-]+/g, " ")
		: "Independent Developer";

	return {
		id: app.id,
		name: app.name,
		slug: app.slug,
		icon: app.icon_url,
		description: app.description,
		subtitle: app.subtitle,
		developer,
		category: formatCategoryLabel(app.primary_category),
		rawCategory: app.primary_category,
		subcategory: app.subcategory,
		version: "1.0.0",
		size: "—",
		lastUpdated: new Date(app.updated_at).toLocaleDateString(),
		updatedAt: app.updated_at,
		type: "developed",
		status:
			app.status === "approved"
				? "published"
				: app.status === "pending_review"
					? "in-review"
					: "draft",
		downloads: "0",
		revenue: "$0",
		rating: 0,
		price: formatAppPrice(app),
		ageRating: app.age_rating,
		...overrides,
	};
}

export function matchesCategoryFilter(app: StoreApp, filter: string) {
	if (!filter || filter === "all") {
		return true;
	}

	return app.rawCategory.toLowerCase() === filter.toLowerCase();
}

export function getUniqueCategories(apps: StoreApp[]) {
	const categories = new Map<string, number>();

	for (const app of apps) {
		const key = app.rawCategory.toLowerCase();
		categories.set(key, (categories.get(key) ?? 0) + 1);
	}

	return [...categories.entries()]
		.sort(([left], [right]) => left.localeCompare(right))
		.map(([value, count]) => ({
			value,
			label: formatCategoryLabel(value),
			count,
		}));
}

export function sortAppsByRecent(apps: StoreApp[]) {
	return [...apps].sort(
		(left, right) =>
			new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime()
	);
}

export function filterStoreAppsByQuery(apps: StoreApp[], query: string) {
	const normalizedQuery = query.trim().toLowerCase();

	if (!normalizedQuery) {
		return apps;
	}

	return apps
		.map((app) => {
			const name = app.name.toLowerCase();
			const slug = app.slug.toLowerCase();
			const category = app.category.toLowerCase();
			const developer = app.developer.toLowerCase();
			const description = app.description.toLowerCase();
			let score = 0;

			if (name === normalizedQuery) score += 120;
			if (name.startsWith(normalizedQuery)) score += 60;
			if (slug.startsWith(normalizedQuery)) score += 40;
			if (name.includes(normalizedQuery)) score += 25;
			if (slug.includes(normalizedQuery)) score += 20;
			if (category.includes(normalizedQuery)) score += 15;
			if (developer.includes(normalizedQuery)) score += 10;
			if (description.includes(normalizedQuery)) score += 8;

			return { app, score };
		})
		.filter(({ score }) => score > 0)
		.sort((left, right) => right.score - left.score)
		.map(({ app }) => app);
}
