import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/libs/auth";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { UserId } from "../../../../../types/next-auth";
import { db } from "@/libs/db";
import { pusherServer } from "@/libs/pusher";
import { toPusherChannel } from "@/libs/utils";
import { User } from "../../../../../types/db";

export async function POST(req: Request) {
	try {
		const body = await req.json();
		const { id: idToAdd } = z.object({ id: z.string() }).parse(body);
		const session = await getServerSession(authOptions);
		if (!session) return new Response("Unauthorized", { status: 401 });
		const isAlreadyFriend = (await fetchRedis(
			"sismember",
			`user:${session.user.id}:friends`,
			idToAdd
		)) as Boolean;
		if (isAlreadyFriend) {
			return new Response("You are already friend with this user", {
				status: 400,
			});
		}
		const hasFriendRequest = await fetchRedis(
			"sismember",
			`user:${session.user.id}:incoming_friend_requests`,
			idToAdd
		);
		if (!hasFriendRequest) {
			return new Response("No friend request has been sent before", {
				status: 400,
			});
		}
		const [userRaw, friendRaw] = (await Promise.all([
			fetchRedis("get", `user:${session.user.id}`),
			fetchRedis("get", `user:${idToAdd}`),
		])) as [string, string];
		const user = JSON.parse(userRaw) as User;
		const friend = JSON.parse(friendRaw) as User;
		await Promise.all([
			pusherServer.trigger(
				toPusherChannel(`user:${idToAdd}:friends`),
				"new_friend",
				user 
			),
			pusherServer.trigger(
				toPusherChannel(`user:${session.user.id}:friends`),
				"new_friend",
				friend
			),
			db.sadd(`user:${session.user.id}:friends`, idToAdd),
			db.sadd(`user:${idToAdd}:friends`, session.user.id),
			db.srem(`user:${session.user.id}:incoming_friend_requests`, idToAdd),
		]);
		return new Response("Friend added successfully", { status: 200 });
	} catch (error) {
		if (error instanceof z.ZodError) {
			return new Response("Invalid request payload", { status: 422 });
		}
		console.log(error);
		return new Response("Invalid request", { status: 400 });
	}
}
