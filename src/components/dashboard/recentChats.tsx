"use client";
import { FC } from "react";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { chatIdConstructor } from "@/libs/utils";
import { Message } from "../../../types/db";

interface RecentChatsProps {
	friendsWithLastMessage: {
		id: string;
		email: string;
		name: string;
		image: string;
		messageData: Message;
	}[];
	sessionId: string;
}

const RecentChats: FC<RecentChatsProps> = ({
	friendsWithLastMessage,
	sessionId,
}) => {
	return (
		<div className="mt-8 w-full">
			{friendsWithLastMessage.length === 0 ? (
				<p className="text-zinc-500 text-sm">Nothing to show here...</p>
			) : (
				friendsWithLastMessage.map((friend) => (
					<div
						key={friend.id}
						className="flex items-center justify-between w-full bg-gray-100 ring-offset-0 p-3 rounded-lg border border-gray-200 hover:bg-gray-200 cursor-pointer"
					>
						<Link
							href={`/dashboard/chat/${chatIdConstructor(
								sessionId,
								friend.id
							)}`}
							className="flex items-center"
						>
							<div className="relative h-9 w-9">
								<Image
									src={friend.image}
									fill
									referrerPolicy="no-referrer"
									alt={friend.name}
									className="rounded-full"
								/>
							</div>
							<div className="ml-4">
								<p className="text-lg font-medium text-gray-800 capitalize">
									{friend.name}
								</p>
								<p className="text-xs text-gray-500 mt-1">
									<span className="capitalize">
										{sessionId === friend.messageData.senderId
											? "You"
											: friend.name}
									</span>
									{": "}
									{friend.messageData.text}
								</p>
							</div>
						</Link>
						<ChevronRight color="#d1cccc" size={30} />
					</div>
				))
			)}
		</div>
	);
};

export default RecentChats;
