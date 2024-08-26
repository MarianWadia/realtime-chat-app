"use client";
import Image from "next/image";
import { FC, useEffect, useState } from "react";
import { User } from "../../../../types/db";
import { UserId } from "../../../../types/next-auth";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { chatIdConstructor, toPusherChannel } from "@/libs/utils";
import { pusherClient } from "@/libs/pusher";
import toast from "react-hot-toast";
import UnseenMessageToast from "@/components/ui/unseenMessageToast";
import { Message } from "@/libs/validations/message";

interface SidebarChatsProps {
	friendsData: User[];
	currentUserId: UserId;
}


export interface extendedMessage extends Message {
	senderName: string;
	senderImage: string;
	senderEmail: string;
}

const SidebarChats: FC<SidebarChatsProps> = ({
	friendsData,
	currentUserId,
}) => {
	const [unseenMessages, setUnseenMessages] = useState<Message[]>([]);
	const [friends, setFriends] = useState<User[]>(friendsData);
	const pathname = usePathname();
	const router = useRouter();
	useEffect(() => {
		if (pathname.includes("chat")) {
			setUnseenMessages((prev) =>
				prev.filter((msg) => !pathname.includes(msg.senderId))
			);
		}
	}, [pathname]);

	useEffect(() => {
		pusherClient.subscribe(toPusherChannel(`user:${currentUserId}:chats`));
		pusherClient.subscribe(toPusherChannel(`user:${currentUserId}:friends`));
		const newMessageHandler = (message: extendedMessage) => {
			const shouldNotify = pathname !== `/dashboard/chat/${chatIdConstructor(currentUserId, message.senderId)}`
			if(!shouldNotify) return;
			toast.custom((t)=>(
				<UnseenMessageToast t={t} message={message} sessionId={currentUserId} />
			))
			setUnseenMessages((prev)=>[...prev, message])
		};
		const newFriendHandler = (newFriend: User) => {
			// router.refresh();
			console.log(newFriend)
			setFriends((prev)=> [...prev, newFriend])
		};
		pusherClient.bind("new_message", newMessageHandler);
		pusherClient.bind("new_friend", newFriendHandler);
		return () => {
			pusherClient.unsubscribe(toPusherChannel(`user:${currentUserId}:chats`));
			pusherClient.unsubscribe(
				toPusherChannel(`user:${currentUserId}:friends`)
			);
			pusherClient.unbind("new_message", newMessageHandler);
			pusherClient.unbind("new_friend", newFriendHandler);
		};
	}, [pathname, currentUserId]);
	return (
		<nav className="text-sm text-black flex flex-col h-full">
			<ul role="list" className="flex flex-col h-full gap-y-1">
				{friends?.sort().map((friend) => {
					const unseenMessagesCount = unseenMessages.filter(
						(unseenMsg) => unseenMsg.senderId === friend.id
					).length;
					return (
						<li key={friend.id} className="w-full">
							<a
								href={`/dashboard/chat/${chatIdConstructor(
									currentUserId,
									friend.id
								)}`}
								className="w-full text-gray-700 leading-6 flex flex-row items-center gap-3 cursor-pointer hover:bg-gray-100 hover:text-primary transition-all py-3 rounded-md hover:bg-opacity-50 px-2 *:hover:text-primary *:hover:border-primary"
							>
								<div className="bg-white shrink-0 flex items-center cursor-pointer justify-center h-10 w-10 rounded-full relative border border-gray-200">
									<Image
										src={friend.image}
										fill
										alt="user profile image"
										className="rounded-full"
										referrerPolicy="no-referrer"
									/>
								</div>
								<p className="font-semibold truncate capitalize text-base">
									{friend.name}
								</p>
								{unseenMessagesCount > 0 && (
									<span className="h-7 w-7 bg-primary text-white rounded-full flex items-center justify-center">
										<p className="text-white font-medium text-xs">
											{unseenMessagesCount}
										</p>
									</span>
								)}
							</a>
						</li>
					);
				})}
			</ul>
		</nav>
	);
};

export default SidebarChats;
