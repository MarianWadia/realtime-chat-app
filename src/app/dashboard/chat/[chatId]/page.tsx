import { authOptions } from "@/libs/auth";
import { db } from "@/libs/db";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import { FC } from "react";
import { User } from "../../../../../types/db";
import { Message } from "postcss";
import { fetchRedis } from "@/helpers/redis";
import { messageValidator } from "@/libs/validations/message";
import Image from "next/image";
import Button from "@/components/ui/Button";
import Messages from "@/components/dashboard/chat/messages";

interface ChatPageProps {
	params: {
		chatId: string;
	};
}

async function getChatInitialMessages(chatId: string) {
	try {
		const results = (await fetchRedis(
			"zrange",
			`chat:${chatId}:messages`,
			0,
			-1
		)) as string[];
		const dbMessages = results.map((message) => JSON.parse(message) as Message);
		const reversedDbMessages = dbMessages.reverse();
		const messages = messageValidator.parse(reversedDbMessages);
		return messages;
	} catch (error) {
		console.log("error", error);
	}
}

const ChatPage: FC<ChatPageProps> = async ({ params }) => {
	const session = await getServerSession(authOptions);
	console.log(session);
	const { chatId } = params;
	if (!session) notFound();
	const [userId1, userId2] = chatId.split("--");
	console.log("userId1", userId1);
	console.log("userId2", userId2);
	if (userId1 !== session.user.id && userId2 !== session.user.id) {
		notFound();
	}
	const chatPartnerId = userId1 === session.user.id ? userId2 : userId1;
	console.log("chatPartnerId", chatPartnerId);
	const chatPartnerData = (await db.get(`user:${chatPartnerId}`)) as User;
	console.log("chatPartnerData", chatPartnerData);
	const initialMessages = await getChatInitialMessages(chatId);
	return (
		<div className="w-full h-full flex flex-1 justify-between flex-col py-12 px-8">
			<div className="w-full flex flex-row border-b-[1px] border-b-gray-200 gap-4 pb-4">
				<div className="relative h-8 w-8 md:h-12 md:w-12">
					<Image
						src={chatPartnerData.image}
						fill
						referrerPolicy="no-referrer"
						alt="chat partner profile"
						className="rounded-full"
					/>
				</div>
				<div className="flex flex-col">
					<p className="text-xl leading-6 font-semibold text-gray-800 capitalize">
						{chatPartnerData.name}
					</p>
					<p className="text-sm text-gray-400">{chatPartnerData.email}</p>
				</div>
			</div>

			<Messages />

			<div className="w-full border-t-[1px] border-t-gray-200 pt-4">
				<div className="mx-4 h-[100px] outline-none border border-gray-300 flex flex-col rounded-lg">
					<input
						type="text"
						name="message-input"
						id="message-input"
						className="border-none outline-none w-full px-4 placeholder:text-gray-400 placeholder:font-light"
						placeholder={`Message ${chatPartnerData.name}`}
					/>
					<Button className="self-end">Send</Button>
				</div>
			</div>
		</div>
	);
};

export default ChatPage;
