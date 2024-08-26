"use client";
import { FC, useEffect } from "react";
import { useState } from "react";
import {
	Dialog,
	DialogBackdrop,
	DialogPanel,
	DialogTitle,
	TransitionChild,
} from "@headlessui/react";
import { BotMessageSquare, Menu, X } from "lucide-react";
import Link from "next/link";
import Button, { buttonVariants } from "./Button";
import { User } from "../../../types/db";
import SidebarChats from "../dashboard/layout/sidebarChats";
import { Session } from "next-auth";
import FriendRequestsItem from "../dashboard/layout/friendRequestsItem";
import Image from "next/image";
import LogoutButton from "../dashboard/layout/logoutButton";
import { usePathname } from "next/navigation";

interface MobileChatLayoutProps {
	friendsData: User[];
	session: Session;
	friendRequests: number;
	sidebarOptions: SidebarOption[];
}

const MobileChatLayout: FC<MobileChatLayoutProps> = ({
	friendsData,
	session,
	friendRequests,
	sidebarOptions,
}) => {
	const [open, setOpen] = useState(true);
    const pathname = usePathname()
    const [originalPathname, setOriginalPathname] = useState(pathname)
    useEffect(()=>{
        if(originalPathname !== pathname){
            setOpen(false)
            setOriginalPathname(pathname)
        }
    },[pathname, originalPathname])
    return (
		<div className="absolute top-0 w-full bg-zinc-50 border-b border-zinc-200 py-2 px-4">
			<div className="w-full flex items-center justify-between w-max-sm">
				<Link
					href="/dashboard"
					className="shrink-0"
				>
					<BotMessageSquare color="#159e6e" size="40px" strokeWidth={2} />
				</Link>
				<Button className="gap-4" onClick={() => setOpen(!open)}>
					Menu <Menu size="20px" />
				</Button>
			</div>
			<Dialog open={open} onClose={setOpen} className="flex md:hidden relative z-10">
				<DialogBackdrop
					transition
					className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity duration-500 ease-in-out data-[closed]:opacity-0"
				/>

				<div className="fixed inset-0 overflow-hidden">
					<div className="absolute inset-0 overflow-hidden">
						<div className="pointer-events-none fixed inset-y-0 left-0 flex max-w-full pr-10">
							<DialogPanel
								transition
								className="pointer-events-auto relative w-screen max-w-md transform transition duration-500 ease-in-out data-[closed]:-translate-x-full sm:duration-700"
							>
								<TransitionChild>
									<div className="absolute right-0 top-0 -ml-8 flex pr-2 pt-4 duration-500 ease-in-out data-[closed]:opacity-0 sm:-ml-10 sm:pr-4">
										<button
											type="button"
											onClick={() => setOpen(false)}
											className="relative rounded-md text-gray-300 hover:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
										>
											<span className="absolute -inset-2.5" />
											<span className="sr-only">Close panel</span>
											<X aria-hidden="true" className="h-6 w-6" />
										</button>
									</div>
								</TransitionChild>
								<div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
									<div className="px-2 sm:px-2 h-full">
										<DialogTitle className="h-full text-base font-semibold leading-6 text-gray-900">
											<div className="relative mt-6 flex-1 px-2 sm:px-2 h-full">
												<div className="flex w-full h-full overflow-y-auto flex-col gap-y-6 pb-4">
													<Link href="/dashboard" className="shrink-0 px-2">
														<BotMessageSquare
															color="#159e6e"
															size="40px"
															strokeWidth={2}
														/>
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
																<p className="font-semibold truncate">
																	{option.title}
																</p>
															</Link>
														))}
														<FriendRequestsItem
															sessionId={session.user.id as string}
															initialFriendRequests={friendRequests}
														/>
													</div>

													<div className="px-2 flex flex-row w-full gap-x-3 items-center">
														<div className="relative h-11 w-11 bg-gray-50">
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
																	className="text-xl text-gray-900 font-semibold capitalize"
																>
																	{session.user.name}
																</p>
																<p
																	aria-hidden={true}
																	className="text-sm font-medium text-gray-400"
																>
																	{session.user.email}
																</p>
															</div>
															<LogoutButton className="h-full aspect-square" />
														</div>
													</div>
												</div>
											</div>
										</DialogTitle>
									</div>
								</div>
							</DialogPanel>
						</div>
					</div>
				</div>
			</Dialog>
		</div>
	);
};

export default MobileChatLayout;
