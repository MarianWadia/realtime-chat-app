import { authOptions } from "@/libs/auth";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import { FC } from "react";
import { User } from "../../../../../types/db";
import { fetchRedis } from "@/helpers/redis";
import {
	Message,
	messageArrayValidator,
	messageValidator,
} from "@/libs/validations/message";
import Image from "next/image";
import Messages from "@/components/dashboard/chat/messages";
import ChatInput from "@/components/dashboard/chat/chatInput";

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
		const dbMessages: Message[] = results.map(
			(message) => JSON.parse(message) as Message
		);
		const reversedDbMessages = dbMessages.reverse();
		const messages = messageArrayValidator.parse(reversedDbMessages);
		return messages;
	} catch (error) {
		console.log("error", error);
	}
}

const ChatPage: FC<ChatPageProps> = async ({ params }) => {
	await new Promise((resolve)=>setTimeout(resolve,5000))
	const session = await getServerSession(authOptions);
	const { chatId } = params;
	if (!session) notFound();
	const [userId1, userId2] = chatId.split("--");
	if (userId1 !== session.user.id && userId2 !== session.user.id) {
		notFound();
	}
	const chatPartnerId = userId1 === session.user.id ? userId2 : userId1;
	const chatPartnerRaw = (await fetchRedis('get', `user:${chatPartnerId}`)) as string
	const chatPartnerData = JSON.parse(chatPartnerRaw) as User;
	const initialMessages = await getChatInitialMessages(chatId);
	return (
		<div className="w-full h-full flex flex-1 justify-between flex-col py-12 px-8">
			<div className="w-full flex flex-row border-b-[1px] border-b-gray-200 gap-4 pb-4 mt-10 md:mt-0">
				<div className="relative h-10 w-10 md:h-12 md:w-12">
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

			<Messages
				initialMessages={initialMessages as Message[]}
				sessionId={session.user.id}
				sessionImg={(session.user.image) as string}
				chatPartnerImg={chatPartnerData.image}
				chatId={chatId}
			/>
			<ChatInput chatPartnerData={chatPartnerData} chatId={chatId} />
		</div>
	);
};

export default ChatPage;
