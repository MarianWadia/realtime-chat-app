"use client";
import Button from "@/components/ui/Button";
import { BotMessageSquare } from "lucide-react";
import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";

export default function LoginPage() {
	async function loginWithGoogle() {
		setIsLoading(true);
		try {
			await signIn("google");
		} catch (error) {
            toast.error('Something went wrong')
		} finally {
			setIsLoading(false);
		}
	}
	const [isLoading, setIsLoading] = useState<boolean>(false);
	return (
		<section className="w-full min-h-full flex flex-col items-center justify-center py-16 space-y-10 px-6">
			<div className="flex flex-col lg:flex-row items-center gap-4">
				<BotMessageSquare color="#159e6e" size="40px" strokeWidth={2} />
				<h3 className="text-xl md:text-3xl font-medium text-center">
					Welcome to
					<span className="text-[#159e6e] font-extrabold text-xl md:text-3xl mx-2">
						Converso
					</span>
					Chatting App
				</h3>
			</div>
			<div className="flex flex-col space-y-8">
				<h2 className="text-2xl md:text-3xl lg:text-4xl text-gray-900 tracking-tight font-extrabold text-center">
					Sign in to your account
				</h2>
				<Button
					type="button"
					className="w-full max-w-sm mx-auto gap-3 py-6"
					isLoading={isLoading}
					onClick={loginWithGoogle}
				>
					<FcGoogle size="25px" />
					<p className="text-xl">Google</p>
				</Button>
			</div>
		</section>
	);
}
