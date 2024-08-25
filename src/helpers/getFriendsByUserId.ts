import { db } from "@/libs/db";
import { UserId } from "../../types/next-auth";
import { fetchRedis } from "./redis";
import { User } from "../../types/db";

export async function getFriendsById(currentUserId: string) {
	const actualFriendsIds = (await fetchRedis(
		"smembers",
		`user:${currentUserId}:friends`
	)) as UserId[];
	// the promise.all here is used to fetch friendData by its id and because we fetch more than one time each friend at a time we used promise.all to fetch all of them at the same time
	const friendsData = await Promise.all(
		actualFriendsIds.map(async (friendId) => {
			const friendData = (await db.get(`user:${friendId}`)) as User;
			return {
				id: friendId,
				email: friendData.email,
				name: friendData.name,
				image: friendData.image,
			};
		})
	);
	return friendsData;
}
