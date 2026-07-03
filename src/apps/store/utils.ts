export const getPageTitle = (path: string) => {
	const titles: Record<string, string> = {
		overview: "Overview",
		billing: "Billing & Subscriptions",
		settings: "Settings",
		support: "Support",
		publish: "Publish App",
		api: "API",
		arcade: "Arcade",
		categories: "Categories",
		search: "Search",
		"my-apps": "My Apps",
		purchases: "Purchases",
		reviews: "My Reviews",
		"developer/apps": "My Apps",
	};
	return titles[path] || "Overview";
};
