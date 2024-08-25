import { FC } from "react";
import { extendedMessage } from "../dashboard/layout/sidebarChats";
import toast, { type Toast } from "react-hot-toast";
import { chatIdConstructor, cn } from "@/libs/utils";
import Image from "next/image";

interface UnseenMessageToastProps {
	message: extendedMessage;
	t: Toast;
  sessionId: string;
}

const UnseenMessageToast: FC<UnseenMessageToastProps> = ({ message, t, sessionId}) => {
  console.log('message', message)
	return (
		<div
			className={cn(
				"max-w-md w-full bg-white shadow-lg rounded-lg ring-black ring-1 flex pointer-events-auto ring-opacity-5",
				{
					"animate-enter": t.visible,
					"animate-leave": !t.visible,
				}
			)}
		>
			<a
				onClick={() => toast.dismiss(t.id)}
				href={`/dashboard/chat/${chatIdConstructor(
					sessionId,
					message.senderId
				)}`}
				className="w-4/5 p-4 flex flex-row items-center gap-x-3"
			>
				<span className="relative w-12 h-12">
					<Image
						fill
						src={message.senderImage}
						alt={`${message.senderName} profile image`}
						referrerPolicy="no-referrer"
						sizes="100%"
            className="rounded-full"
					/>
				</span>
        <span className="flex flex-col gap-y-0">
          <p className="text-lg capitalize font-medium text-gray-900">{message.senderName}</p>
          <p className="text-sm text-gray-400 text-ellipsis">{message.text}</p>
        </span>
			</a>
			<button onClick={()=>toast.dismiss(t.id)} className="flex-1 border-l border-l-gray-200 p-4 font-medium text-primary hover:bg-gray-100 text-lg">close</button>
		</div>
	);
};

export default UnseenMessageToast;
