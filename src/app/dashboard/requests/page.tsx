import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/libs/auth";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import { FC } from "react";
import { UserId } from "../../../../types/next-auth";
import { User } from "@/../types/db";
import FriendRequests from "@/components/dashboard/requests/friendRequests";
interface RequestsPage {}

const RequestsPage: FC<RequestsPage> = async ({}) => {
	const session = await getServerSession(authOptions);
	if (!session) notFound();
	const incomingRequestsId = (await fetchRedis(
		"smembers",
		`user:${session.user.id}:incoming_friend_requests`
	)) as UserId[];

	const incomingFriendRequests = await Promise.all(
		incomingRequestsId.map(async (senderId) => {
			const senderRaw = (await fetchRedis('get', `user:${senderId}`)) as string;
			const sender = JSON.parse(senderRaw) as User;
			return {
				id: senderId,
				email: sender.email,
				name: sender.name,
				image: sender.image,
			};
		})
	);

	return (
		<main className="max-w-sm md:max-w-2xl 2xl:max-w-3xl">
			<div className="mx-6 md:mx-12 my-32 md:my-24 flex flex-col">
				<h1 className="text-4xl xl:text-5xl font-extrabold text-gray-800">
					Friend Requests
				</h1>
				<FriendRequests
					incomingFriendRequests={incomingFriendRequests}
					sessionId={session.user.id}
				/>
			</div>
		</main>
	);
};

export default RequestsPage;
