import FriendRequestsItem from "@/components/dashboard/layout/friendRequestsItem";
import LogoutButton from "@/components/dashboard/layout/logoutButton";
import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/libs/auth";
import {
	BotMessageSquare,
	UserPlus,
} from "lucide-react";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ReactElement } from "react";
import { UserId } from "../../../types/next-auth";
import { getFriendsById } from "@/helpers/getFriendsByUserId";
import SidebarChats from "@/components/dashboard/layout/sidebarChats";
import MobileChatLayout from "@/components/ui/mobileChatLayout";

interface LayoutProps {
	children: React.ReactNode;
}

const sidebarOptions: SidebarOption[] = [
	{
		href: "/dashboard/add",
		title: "Add friend",
		id: 1,
		Icon: <UserPlus size="16px" strokeWidth={2} />,
	},
];

export default async function Layout({ children }: LayoutProps) {
	const session = await getServerSession(authOptions);
	if (!session) notFound();
	const friendRequests = (
		(await fetchRedis(
			"smembers",
			`user:${session.user.id}:incoming_friend_requests`
		)) as UserId[]
	).length;
	const friendsData = await getFriendsById(session.user.id);
	return (
		<div className="flex flex-row w-full h-screen">
			<div className="w-full max-w-sm grow h-full  overflow-y-auto flex flex-col gap-y-6 px-4 py-4 border-r border-gray-400 bg-white">
				<Link href="/dashboard" className="shrink-0 px-2">
					<BotMessageSquare color="#159e6e" size="40px" strokeWidth={2} />
				</Link>

				{friendsData.length > 0 && (
					<div className="flex max-h-[400px] h-fit overflow-y-auto flex-col gap-5 px-2">
						<p className="text-xs font-semibold leading-6 text-gray-400">
							Your chats
						</p>
						<SidebarChats
							currentUserId={session.user.id}
							friendsData={friendsData}
						/>
					</div>
				)}

				<div className="flex-grow flex flex-col">
					<p className="text-xs font-semibold leading-6 text-gray-400 px-2">
						Overview
					</p>
					{sidebarOptions.map((option) => (
						<Link
							key={option.id}
							href={option.href}
							className="w-full text-gray-700 leading-6 flex flex-row items-center gap-3 cursor-pointer hover:bg-gray-100 hover:text-primary transition-all py-3 rounded-md hover:bg-opacity-50 px-2 *:hover:text-primary *:hover:border-primary"
						>
							<div className="bg-white shrink-0 flex items-center cursor-pointer justify-center h-7 w-7 rounded-lg border border-gray-200">
								{option.Icon}
							</div>
							<p className="font-semibold truncate">{option.title}</p>
						</Link>
					))}
					<FriendRequestsItem
						sessionId={session.user.id as string}
						initialFriendRequests={friendRequests}
					/>
				</div>

				<div className="px-2 flex flex-row w-full gap-x-3 items-center">
					<div className="relative w-8 h-8 xl:h-11 xl:w-11 bg-gray-50">
						<Image
							src={session.user.image as string}
							alt="user-image"
							fill
							className="rounded-full"
							referrerPolicy="no-referrer"
						/>
					</div>
					<span className="sr-only">Your Profile</span>
					<div className="flex flex-row flex-1 justify-between items-center">
						<div className="space-y-1">
							<p
								aria-hidden={true}
								className="text-base xl:text-xl text-gray-900 font-semibold capitalize"
							>
								{session.user.name}
							</p>
							<p
								aria-hidden={true}
								className="text-xs font-medium text-gray-400 truncate"
							>
								{session.user.email}
							</p>
						</div>
						<LogoutButton className="h-full aspect-square" />
					</div>
				</div>
			</div>
			<div className="flex-1">{children}</div>
		</div>
	);
}
