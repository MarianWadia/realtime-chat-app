import { getFriendsById } from "@/helpers/getFriendsByUserId";
import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/libs/auth";
import { chatIdConstructor } from "@/libs/utils";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import { FC } from "react";
import { Message } from "../../../types/db";
import RecentChats from "@/components/dashboard/recentChats";

interface HomePageProps {}

const HomePage: FC<HomePageProps> = async ({}) => {
	const session = await getServerSession(authOptions);
	if (!session) notFound();
	const friends = await getFriendsById(session?.user?.id as string);
	const friendsWithLastMessage = await Promise.all(
		friends.map(async (friend) => {
			const [lastMessage] = (await fetchRedis(
				"zrange",
				`chat:${chatIdConstructor(session.user.id, friend.id)}:messages`,
				-1,
				-1
			)) as string[];
			if(!lastMessage){
				return null
			}
			const messageData = JSON.parse(lastMessage) as Message;
			return {
				...friend,
				messageData,
			};
		})
	);
	const recentChats = friendsWithLastMessage.filter(
		(friend): friend is { id: string; email: string; name: string; image: string; messageData: Message } => friend !== null
	  );
	return (
		<main className="sm:max-w-sm md:max-w-2xl 2xl:max-w-3xl">
			<div className="mx-4 md:mx-12 my-24 flex flex-col">
				<h1 className="text-5xl font-extrabold text-gray-800">Recent Chats</h1>
				<RecentChats
					sessionId={session.user.id}
					friendsWithLastMessage={recentChats}
				/>
			</div>
		</main>
	);
};

export default HomePage;
