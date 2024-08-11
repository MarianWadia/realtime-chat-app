const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;

type Command = "sismember" | "get" | "zrange" | "smembers";

export async function fetchRedis(
	command: Command,
	...args: (string | number)[]
) {
	const response = await fetch(`${upstashUrl}/${command}/${args.join("/")}`, {
		headers: {
			Authorization: `Bearer ${upstashToken}`,
		},
		cache: "no-store",
	});
	if (!response.ok) {
		throw new Error(`Error executing redis command: ${response.statusText}`);
	}
	const data = await response.json();
	return data.result;
}
