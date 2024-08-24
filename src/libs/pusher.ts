import PusherClient from "pusher-js";
import PusherServer from "pusher";

export const pusherServer = new PusherServer({
	key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY!,
	appId: process.env.PUSHER_APP_ID!,
	secret: process.env.PUSHER_APP_SECRET!,
	useTLS: true,
	cluster: "eu",
});

export const pusherClient = new PusherClient(
	process.env.NEXT_PUBLIC_PUSHER_APP_KEY!,
	{
		cluster: "eu",
	}
);
