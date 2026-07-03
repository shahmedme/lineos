import { appStoreRepository } from "./appStoreRepository";
import { Database } from "@/types/database";
import { AppSubmissionForm } from "../pages/publish/types";
import { apiRequest } from "@/lib/api";
import type { StoreApp } from "../types/store";
import { transformAppRow } from "../utils/storeHelpers";

export type { StoreApp };

export const appStoreService = {
	// App management
	async createApp(
		appData: Omit<Database["public"]["Tables"]["apps"]["Insert"], "user_id">
	) {
		return appStoreRepository.createApp(appData);
	},

	async getMyApps(): Promise<StoreApp[]> {
		const data = await appStoreRepository.getAppsByUserId();
		return data.map((app) => transformAppRow(app));
	},

	async getAppDetails(id: number) {
		const [app, assets, territories, reviews] = await Promise.all([
			appStoreRepository.getAppById(id),
			appStoreRepository.getAppAssets(id),
			appStoreRepository.getAppTerritories(id),
			appStoreRepository.getAppReviews(id),
		]);

		return {
			...app,
			assets,
			territories,
			reviews,
		};
	},

	async getAppMetadata(id: number) {
		const app = await appStoreRepository.getAppById(id);
		return app;
	},

	async updateApp(
		id: number,
		appData: Database["public"]["Tables"]["apps"]["Update"]
	) {
		return appStoreRepository.updateApp(id, appData);
	},

	async submitForReview(id: number) {
		return appStoreRepository.updateAppStatus(id, "pending_review");
	},

	// Asset management
	async uploadAppAsset(
		file: File,
		type: "icon" | "screenshots" | "previewVideo"
	) {
		const { fileService } = await import("./fileService");
		const url = await fileService.uploadAppImage(file);
		return {
			url,
			type,
			name: file.name,
		};
	},

	async getAppAssets(appId: number) {
		return appStoreRepository.getAppAssets(appId);
	},

	async deleteAppAsset(assetId: number) {
		return appStoreRepository.deleteAsset(assetId);
	},

	// Territory management
	async updateAppTerritories(appId: number, territoryCodes: string[]) {
		const currentTerritories = await appStoreRepository.getAppTerritories(
			appId
		);
		const currentCodes = currentTerritories.map((t) => t.territory_code);

		const toAdd = territoryCodes.filter((code) => !currentCodes.includes(code));
		const toRemove = currentCodes.filter(
			(code) => !territoryCodes.includes(code)
		);

		if (toAdd.length > 0) {
			await appStoreRepository.addTerritories(appId, toAdd);
		}
		if (toRemove.length > 0) {
			await appStoreRepository.removeTerritories(appId, toRemove);
		}

		return appStoreRepository.getAppTerritories(appId);
	},

	// Review management
	async getAppReviews(appId: number) {
		return appStoreRepository.getAppReviews(appId);
	},

	async reviewApp(
		appId: number,
		status: Database["public"]["Tables"]["app_reviews"]["Insert"]["status"],
		feedback?: string
	) {
		const review = await appStoreRepository.createReview(
			appId,
			status,
			feedback
		);
		await appStoreRepository.updateAppStatus(appId, status);
		return review;
	},

	async publishApp(formData: AppSubmissionForm) {
		try {
			const slug = formData.name
				.toLowerCase()
				.replace(/[^a-z0-9]+/g, "-")
				.replace(/^-+|-+$/g, "");

			const app = await appStoreRepository.createApp({
				name: formData.name,
				description: formData.description,
				primary_category: formData.category,
				subcategory: formData.subcategory,
				support_url: formData.supportUrl ?? "",
				privacy_policy_url: formData.privacyUrl ?? "",
				contact_email: formData.contactEmail ?? "",
				app_url: formData.appUrl,
				status: "pending_review",
				keywords: [],
				pricing_model: "free",
				release_type: "immediate",
				is_preorder: false,
				age_rating: "4+",
				icon_url: formData.icon,
				slug,
			});

			await Promise.all(
				(formData.screenshots ?? []).map((screenshot) =>
					appStoreRepository.createAsset(app.id, {
						asset_type: "screenshot",
						file_path: screenshot.url,
						file_size: screenshot.fileSize ?? 0,
					})
				)
			);

			return {
				success: true,
				message: "App submitted for review successfully",
				data: app,
			};
		} catch (error) {
			console.error("Failed to publish app:", error);
			throw new Error("Failed to submit app for review");
		}
	},

	async getPublishedApps(): Promise<StoreApp[]> {
		const data = await apiRequest<Database["public"]["Tables"]["apps"]["Row"][]>(
			"/api/apps?status=approved"
		);
		return data.map((app) => transformAppRow(app));
	},
};
