"use client";
import { cn, toPusherChannel } from "@/libs/utils";
import { Message } from "@/libs/validations/message";
import { FC, useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import Image from "next/image";
import { pusherClient } from "@/libs/pusher";
interface MessagesProps {
	initialMessages: Message[] | [];
	sessionId: string;
	sessionImg: string;
	chatPartnerImg: string;
	chatId: string;
}

const Messages: FC<MessagesProps> = ({
	initialMessages,
	sessionId,
	chatPartnerImg,
	sessionImg,
	chatId,
}) => {
	const scrollDownRef = useRef<HTMLDivElement | null>(null);
	const [messages, setMessages] = useState<Message[]>(initialMessages);
	function formatDate(timestamp: number) {
		return format(timestamp, "dd/MM hh:mm aa");
	}
	useEffect(() => {
		pusherClient.subscribe(toPusherChannel(`chat:${chatId}`));
		const handleMessages = (message: Message) => {
			setMessages((prev) => [message, ...prev]);
		};
		pusherClient.bind("incoming_messages", handleMessages);
		return () => {
			pusherClient.unsubscribe(toPusherChannel(`chat:${chatId}`));
			pusherClient.unbind("incoming_messages", handleMessages);
		};
	}, [chatId]);
	return (
		<div
			id="messages"
			className="flex-1 flex flex-col-reverse gap-4 p-3 max-h-[calc(100vh-6rem)] overflow-y-auto w-full my-8 scrollbar-w-2 scrollbar-thumb-green scrollbar-track-green-lighter scrolling-touch scrollbar-thumb-rounded"
		>
			<div ref={scrollDownRef}></div>
			{messages?.map((msg, index) => {
				const isCurrentUser = msg.senderId === sessionId;
				const hasNextMessageFromSameUser =
					index > 0 &&
					messages[index - 1].senderId === messages[index].senderId;
				return (
					<div
						className="chat-message"
						key={`${msg.senderId} - ${msg.timestamp}`}
					>
						<div
							className={cn("flex items-end", {
								"justify-end": isCurrentUser,
							})}
						>
							<div
								className={cn("flex flex-col max-w-xs space-y-2 text-base", {
									"items-end order-1": isCurrentUser,
									"order-2 items-start": !isCurrentUser,
								})}
							>
								<span
									className={cn("px-4 py-2 rounded-lg inline-block", {
										"bg-primary text-white": isCurrentUser,
										"bg-gray-200 text-gray-900": !isCurrentUser,
										"rounded-br-none":
											isCurrentUser && !hasNextMessageFromSameUser,
										"rounded-bl-none":
											!isCurrentUser && !hasNextMessageFromSameUser,
									})}
								>
									{msg.text}{" "}
									<span className="text-xs ml-2 text-gray-400">
										{formatDate(msg.timestamp)}
									</span>
								</span>
							</div>
							<div
								className={cn("relative w-6 h-6", {
									"order-2 ml-2": isCurrentUser,
									"order-1 mr-2": !isCurrentUser,
									invisible: hasNextMessageFromSameUser,
								})}
							>
								<Image
									src={isCurrentUser ? (sessionImg as string) : chatPartnerImg}
									alt={
										isCurrentUser ? "your profile image" : "your friend image"
									}
									fill
									referrerPolicy="no-referrer"
									className="rounded-full"
								/>
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
};

export default Messages;
