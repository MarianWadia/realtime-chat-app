import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/libs/auth";
import { db } from "@/libs/db";
import { pusherServer } from "@/libs/pusher";
import { toPusherChannel } from "@/libs/utils";
import { addFriendValidator } from "@/libs/validations/add-friend";
import { getServerSession } from "next-auth";
import { z } from "zod";

export async function POST(req: Request) {
	try {
		const body = await req.json();
		//here we are validating the email one more time in the server side for more security reasons just in case if any one tampered with our application in th frontend
		const { email: emailToAdd } = addFriendValidator.parse({
			email: body.email,
		});
		const userIdToBeAdded = (await fetchRedis(
			"get",
			`user:email:${emailToAdd}`
		)) as string;
		if (!userIdToBeAdded) {
			return new Response("The user you are trying to add does not exist", {
				status: 400,
			});
		}
		const session = await getServerSession(authOptions);
		if (!session) {
			return new Response("You are not authenticated", { status: 401 });
		}
		if (userIdToBeAdded === session.user.id) {
			return new Response("You cannot add yourself as a friend", {
				status: 400,
			});
		}
		const requestIsSent = (await fetchRedis(
			"sismember",
			`user:${userIdToBeAdded}:incoming_friend_requests`,
			session.user.id
		)) as 0 | 1;
		if (requestIsSent) {
			return new Response("You have already sent friend request to this user", {
				status: 400,
			});
		}
		const isAlreadyFriends = (await fetchRedis(
			"sismember",
			`user:${session.user.id}:friends`,
			userIdToBeAdded
		)) as 0 | 1;

		if (isAlreadyFriends) {
			return new Response("You are already friend with this user", {
				status: 400,
			});
		}
		console.log('pusher trigger')
		// The User who is logged in will be added in the list of incoming friend requests of the user needed to be added
		pusherServer.trigger(
			toPusherChannel(`user:${userIdToBeAdded}:incoming_friend_requests`),
			"incoming_friend_requests",
			{
				id: session.user.id,
				email: session.user.email,
				image: session.user.image,
				name: session.user.name
			}
		);
		db.sadd(
			`user:${userIdToBeAdded}:incoming_friend_requests`,
			session.user.id
		);

		return new Response("Ok");
	} catch (error) {
		if (error instanceof z.ZodError) {
			// Because we are using zod email validation here at the server as well so if that fails an error of zodError type will be found
			// statusCode 422 is for Unprocessable Entity; when a request contains valid data that cannot be processed because it fails certain validation rules
			return new Response("Invalid request payload (email)", { status: 422 });
		}
		return new Response("Invalid request", { status: 400 });
	}
}
