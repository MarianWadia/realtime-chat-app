"use client";
import { pusherClient } from "@/libs/pusher";
import { toPusherChannel } from "@/libs/utils";
import { User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FC, useEffect, useState } from "react";

interface FriendRequestsItemProps {
	initialFriendRequests: number;
	sessionId: string;
}
const option = {
	href: "/dashboard/requests",
	title: "Friend requests",
	id: 2,
	Icon: <User size="16px" strokeWidth={2} />,
};
const FriendRequestsItem: FC<FriendRequestsItemProps> = ({
	initialFriendRequests,
	sessionId,
}) => {
	// let unseenFriendRequestsFromLocal: number = 0;
	// if (typeof window !== "undefined") {
	// 	unseenFriendRequestsFromLocal = Number(
	// 		localStorage.getItem("unseenFriendRequests")
	// 	);
	// }
	const [unseenRequestCount, setUnseenRequestCount] = useState<number>(initialFriendRequests);
	const pathname = usePathname();
	const isRequestsOpen = pathname.includes("requests");
	useEffect(() => {
		if (isRequestsOpen) {
			setUnseenRequestCount(0); // Reset the count when the requests page is opened. This ensures the count doesn't persist across sessions.
		}
	}, [isRequestsOpen]);
	useEffect(() => {
		pusherClient.subscribe(
			toPusherChannel(`user:${sessionId}:incoming_friend_requests`)
		);
		const handleFriendRequest = () => {
			setUnseenRequestCount((prev) => prev + 1);
		};
		console.log("pusher subscribed");
		pusherClient.bind("incoming_friend_requests", handleFriendRequest);
		return () => {
			pusherClient.unsubscribe(
				toPusherChannel(`user:${sessionId}:incoming_friend_requests`)
			);
			pusherClient.unbind("incoming_friend_requests", handleFriendRequest);
		};
	}, [sessionId]);
	return (
		<Link
			key={option.id}
			href={option.href}
			className="w-full text-gray-700 leading-6 flex flex-row items-center gap-3 cursor-pointer hover:bg-gray-100 hover:text-primary transition-all py-3 rounded-md hover:bg-opacity-50 px-2 *:hover:text-primary *:hover:border-primary relative"
			onClick={() => setUnseenRequestCount(0)}
		>
			<div className="bg-white shrink-0 flex items-center cursor-pointer justify-center h-7 w-7 rounded-lg border border-gray-200">
				{option.Icon}
			</div>
			<div className="flex flex-row items-center gap-4">
				<p className="font-semibold truncate">{option.title}</p>
				{unseenRequestCount > 0 && (
					<span className="h-6 w-6 rounded-full bg-primary text-white font-semibold text-sm flex items-center justify-center">
						{unseenRequestCount}
					</span>
				)}
			</div>
		</Link>
	);
};

export default FriendRequestsItem;
