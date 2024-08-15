"use client"
import Image from 'next/image'
import { FC } from 'react'
import { User } from '../../../../types/db'
import { UserId } from '../../../../types/next-auth'
import Link from 'next/link'

interface SidebarChatsProps {
    friendsData: User[];
    currentUserId: UserId
}

const SidebarChats: FC<SidebarChatsProps> = ({friendsData, currentUserId}) => {
  return <nav className="text-sm text-black flex flex-col h-full">
            <ul role="list" className="flex flex-col h-full gap-y-1">
                {friendsData.map((friend) => (
                    <li key={friend.id} className="w-full">
                        <Link
                            href={`/dashboard/chat/${currentUserId}--${friend.id}`}
                            className="w-full text-gray-700 leading-6 flex flex-row items-center gap-3 cursor-pointer hover:bg-gray-100 hover:text-primary transition-all py-3 rounded-md hover:bg-opacity-50 px-2 *:hover:text-primary *:hover:border-primary"
                        >
                            <div className="bg-white shrink-0 flex items-center cursor-pointer justify-center h-10 w-10 rounded-full relative border border-gray-200">
                                <Image
                                    src={friend.image}
                                    fill
                                    alt="user profile image"
                                    className="rounded-full"
                                    referrerPolicy="no-referrer"
                                />
                            </div>
                            <p className="font-semibold truncate capitalize text-base">{friend.name}</p>
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
}

export default SidebarChats