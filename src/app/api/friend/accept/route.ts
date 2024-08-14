import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/libs/auth";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { UserId } from "../../../../../types/next-auth";
import { db } from "@/libs/db";

async function POST(req: Request) {
	try {
		const body = await req.json();
		const { id: idToAdd } = z.object({ id: z.string() }).parse(body);
		const session = await getServerSession(authOptions);
        if(!session) return new Response('Unauthorized', {status: 401})
        const isAlreadyFriend = (await fetchRedis('sismember', `user:${session.user.id}:friends`)) as Boolean
        if (isAlreadyFriend) {
            return new Response('You are already friend with this user', {status: 400})
        }
        const hasFriendRequest = await fetchRedis('sismember', `user:${session.user.id}:incoming_friend_requests`, idToAdd) 
        await db.sadd(`user:${session.user.id}:friends`, idToAdd)
    } catch (error) {
		console.log(error);
	}
}
