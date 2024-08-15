import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/libs/auth";
import { db } from "@/libs/db";
import { getServerSession } from "next-auth";
import { z } from "zod";

export async function POST(req: Request){
    try {
		const body = await req.json();
		const { id: idToDeny } = z.object({ id: z.string() }).parse(body);
		const session = await getServerSession(authOptions);
		console.log("session", session);
		if (!session) return new Response("Unauthorized", { status: 401 });
		const isAlreadyFriend = (await fetchRedis(
			"sismember",
			`user:${session.user.id}:friends`,
			idToDeny
		)) as Boolean;
		if (isAlreadyFriend) {
			return new Response("You are already friend with this user", {
				status: 400,
			});
		}
		const hasFriendRequest = await fetchRedis(
			"sismember",
			`user:${session.user.id}:incoming_friend_requests`,
			idToDeny
		);
		if (!hasFriendRequest) {
			return new Response("No friend request has been sent before", {
				status: 400,
			});
		}
		// await db.sadd(`user:${session.user.id}:friends`, idToDeny);
		// await db.sadd(`user:${idToDeny}:friends`, session.user.id);
		await db.srem(`user:${session.user.id}:incoming_friend_requests`, idToDeny);
		return new Response("Friend request denied successfully", { status: 200 });
	} catch (error) {
		if (error instanceof z.ZodError) {
			return new Response("Invalid request payload", { status: 422 });
		}
		console.log(error);
		return new Response("Invalid request", { status: 400 });
	}
}