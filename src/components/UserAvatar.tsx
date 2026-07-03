import type { User } from "@/types/auth";
import { cn } from "@/utils";
import type { CSSProperties } from "react";

type UserAvatarProps = {
	user?: User | null;
	className?: string;
};

export function getUserDisplayName(user?: User | null) {
	const fullName = [user?.user_metadata.first_name, user?.user_metadata.last_name]
		.filter(Boolean)
		.join(" ")
		.trim();

	if (fullName) {
		return fullName;
	}

	if (user?.email) {
		return user.email.split("@")[0];
	}

	return "User";
}

export function getAvatarColorStyle(name: string): CSSProperties {
	let hash = 0;

	for (const char of name) {
		hash = char.charCodeAt(0) + ((hash << 5) - hash);
	}

	const hue = Math.abs(hash) % 360;
	return {
		backgroundColor: `hsl(${hue} 58% 46%)`,
	};
}

export default function UserAvatar({ user, className }: UserAvatarProps) {
	const displayName = getUserDisplayName(user);
	const initial = displayName.charAt(0).toUpperCase();
	const avatarUrl = user?.user_metadata.avatar_url?.trim();

	if (avatarUrl) {
		return (
			<img
				src={avatarUrl}
				alt={displayName}
				className={cn("h-full w-full object-cover", className)}
			/>
		);
	}

	return (
		<div
			aria-hidden="true"
			className={cn(
				"flex h-full w-full items-center justify-center text-sm font-normal text-white",
				className
			)}
			style={getAvatarColorStyle(displayName)}
		>
			{initial}
		</div>
	);
}
