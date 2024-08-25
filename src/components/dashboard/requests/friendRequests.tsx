"use client";
import { FC, useEffect, useState } from "react";
import { User } from "../../../../types/db";
import Image from "next/image";
import Button from "@/components/ui/Button";
import axios from "axios";
import { notFound, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { pusherClient } from "@/libs/pusher";
import { toPusherChannel } from "@/libs/utils";

interface FriendRequestsProps {
	incomingFriendRequests: User[];
	sessionId: string;
}

const FriendRequests: FC<FriendRequestsProps> = ({
	incomingFriendRequests,
	sessionId,
}) => {
	const [incomingRequests, setIncomingRequests] = useState(
		incomingFriendRequests
	);
	const router = useRouter();
	async function acceptFriendRequest(senderId: string) {
		try {
			await axios.post("/api/friend/accept", {
				id: senderId,
			});
			setIncomingRequests((prev) =>
				prev.filter((item) => item.id !== senderId)
			);
			router.refresh();
			toast.success("Friend request accepted!");
		} catch (error) {
			console.log("error", error);
		}
	}
	async function denyFriendRequest(senderId: string) {
		try {
			await axios.post("/api/friend/deny", {
				id: senderId,
			});
			setIncomingRequests((prev) =>
				prev.filter((item) => item.id !== senderId)
			);
			router.refresh();
			toast.success("Friend denied successfully!");
		} catch (error) {
			notFound();
		}
	}
	useEffect(() => {
		pusherClient.subscribe(
			toPusherChannel(`user:${sessionId}:incoming_friend_requests`)
		);
		const handleFriendRequest = ({
			name, email, image, id
		}: User) => {
			console.log("new Friend request");
			setIncomingRequests((prev) => [...prev, { name, email, image, id }]);
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
		<div className="mt-8">
			{incomingRequests.length === 0 ? (
				<p className="text-zinc-500 text-sm">Nothing to show here...</p>
			) : (
				incomingRequests.map((req) => (
					<div key={req.id} className="flex items-center justify-between">
						<div className="flex items-center">
							<div className="relative h-9 w-9">
								<Image
									src={req.image}
									fill
									referrerPolicy="no-referrer"
									alt={req.name}
									className="rounded-full"
								/>
							</div>
							<div className="ml-4">
								<p className="text-sm font-medium text-gray-800">{req.name}</p>
								<p className="text-xs text-gray-500">{req.email}</p>
							</div>
						</div>
						<div className="flex flex-row gap-4">
							<Button
								onClick={() => acceptFriendRequest(req.id)}
								aria-label="accept-friend"
								className="bg-primary transition-colors hover:bg-green-800"
							>
								Accept
							</Button>
							<Button
								onClick={() => denyFriendRequest(req.id)}
								aria-label="decline-friend"
								className="bg-red-600 transition-colors hover:bg-red-800"
							>
								Decline
							</Button>
						</div>
					</div>
				))
			)}
		</div>
	);
};

export default FriendRequests;
