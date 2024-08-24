import { getFriendsById } from "@/helpers/getFriendsByUserId";
import { authOptions } from "@/libs/auth";
import { db } from "@/libs/db";
import { Message, messageValidator } from "@/libs/validations/message";
import { getServerSession } from "next-auth";
import { nanoid } from "nanoid";
import { pusherServer } from "@/libs/pusher";
import { toPusherChannel } from "@/libs/utils";
export async function POST(req: Request) {
	try {
		const { text, chatId }: { text: string; chatId: string } = await req.json();
		const session = await getServerSession(authOptions);
		if (!session) return new Response("Unauthorized", { status: 401 });
		const [userId1, userId2] = chatId.split("--");
		if (userId1 !== session.user.id && userId2 !== session.user.id) {
			return new Response("Unauthorized", { status: 401 });
		}
		const friendId = userId1 === session.user.id ? userId2 : userId1;
		const currentUserFriends = await getFriendsById(session.user.id);
		const isFriend = currentUserFriends.find(
			(friend) => friend.id === friendId
		);
		if (!isFriend) {
			return new Response("Unauthorized", { status: 401 });
		}
		const timestamp = Date.now();
		const messageData: Message = {
			id: nanoid(),
			senderId: session.user.id,
			timestamp,
			text,
		};
		const message = messageValidator.parse(messageData);
		pusherServer.trigger(
			toPusherChannel(`chat:${chatId}`),
			"incoming_messages",
			message
		);
		await db.zadd(`chat:${chatId}:messages`, {
			score: timestamp,
			member: JSON.stringify(message),
		});
		return new Response("OK");
	} catch (error) {
		if (error instanceof Error) {
			return new Response(error.message, { status: 500 });
		}
		return new Response("Internal Server Error", { status: 500 });
	}
}
