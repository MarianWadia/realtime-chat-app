"use client";
import Button from "@/components/ui/Button";
import { FC, useRef, useState } from "react";
import { User } from "../../../../types/db";
import TextAreaAutoSize from "react-textarea-autosize";
import axios from "axios";
import toast from "react-hot-toast";

interface ChatInputProps {
	chatPartnerData: User;
    chatId: string
}

const ChatInput: FC<ChatInputProps> = ({ chatPartnerData, chatId }) => {
	const textareaRef = useRef<HTMLTextAreaElement | null>(null);
	const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState<boolean>(false)
	const sendMessage = async () => {
		if(!input) return;
        setIsLoading(false)
        try {
            await axios.post('/api/messages/send',{
                text: input,
                chatId
            })
            setInput('')
            textareaRef.current?.focus()
        } catch (error) {
            toast.error('Something went wrong. Please try again later.')
            console.log(error)
        }finally {
            setIsLoading(false)
        }
    };
	return (
		<div className="w-full border-t-[1px] border-t-gray-200 pt-4">
			<div className="mx-4 outline-none border border-gray-300 flex flex-col rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-primary">
				<TextAreaAutoSize
					className="border-none outline-none border-0 outline-0 resize-none bg-transparent border-transparent outline-transparent w-full px-4 placeholder:text-gray-400 placeholder:font-light text-gray-900 focus:ring-0 sm:text-sm"
					name="message-input"
					id="message-input"
					placeholder={`Message ${chatPartnerData.name}`}
					ref={textareaRef}
					onKeyDown={(e) => {
						if (e.key === "Enter" && !e.shiftKey) {
							e.preventDefault();
							sendMessage();
						}
					}}
					rows={1}
					value={input}
					onChange={(e) => setInput(e.target.value)}
				/>
				<Button
					onClick={sendMessage}
					type="submit"
                    isLoading={isLoading}
                    size='lg'
					className="self-end mr-2 my-2"
				>
					Send
				</Button>
			</div>
		</div>
	);
};

export default ChatInput;
