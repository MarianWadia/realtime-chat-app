import { authOptions } from "@/libs/auth";
import { db } from "@/libs/db";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import { FC } from "react";
import { User } from "../../../../../types/db";
import { Message } from "postcss";
import { fetchRedis } from "@/helpers/redis";
import { messageValidator } from "@/libs/validations/message";

interface ChatPageProps {
	params: {
		chatId: string;
	};
}

async function getChatInitialMessages(chatId: string) {
  try {
    const results = (await fetchRedis('zrange', `chat:${chatId}:messages`, 0, -1))as string[];
    const dbMessages = results.map((message) => JSON.parse(message) as Message);
    const reversedDbMessages = dbMessages.reverse()
    const messages = messageValidator.parse(reversedDbMessages)
    return messages;
  } catch (error) {
    console.log('error', error)
  }
}

const ChatPage: FC<ChatPageProps> = async ({ params }) => {
	const session = await getServerSession(authOptions);
  console.log(session)
	const { chatId } = params;
	if (!session) notFound();
  const [userId1, userId2] = chatId.split("--")
  console.log('userId1', userId1)
  console.log('userId2', userId2)
  if(userId1 !== session.user.id && userId2 !== session.user.id){
    notFound()
  }
  const chatPartnerId = userId1 === session.user.id ? userId2 : userId1
  console.log('chatPartnerId', chatPartnerId)
  const chatPartnerData = (await db.get(`user:${chatPartnerId}`)) as User
  console.log('chatPartnerData', chatPartnerData)
  const initialMessages = await getChatInitialMessages(chatId)
  return <div>ChatPage</div>;
};

export default ChatPage;
