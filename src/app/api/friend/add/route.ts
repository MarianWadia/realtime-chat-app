import { authOptions } from "@/libs/auth";
import { addFriendValidator } from "@/libs/validations/add-friend";
import { getServerSession } from "next-auth";

export async function POST(req: Request) {
	try {
		const body = await req.json();
		//here we are validating the email one more time in the server side for more security reasons just in case if any one tampered with our application in th frontend
		const { email: emailToAdd } = addFriendValidator.parse(body.email);
		const RESTResponse = await fetch(
			`${process.env.UPSTASH_REDIS_REST_URL}/get/user:email:${emailToAdd}`,
			{
				headers: {
					Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
				},
				cache: "no-store",
			}
		);
		const { result: userId } = (await RESTResponse.json()) as {
			result: string | null;
		};
        if(!userId){
            return new Response('The user you are trying to add does not exist', {
                status: 400
            })
        }
		console.log("userId", userId);
		const session = await getServerSession(authOptions);
		if (!session) {
			return new Response("You are not authenticated", { status: 401 });
		}
        if(userId === session.user.id){
            return new Response('You cannot add yourself as a friend', {
                status: 400
            })
        }

	} catch (error) {}
}
