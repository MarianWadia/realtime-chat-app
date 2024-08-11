"use client";
import Button from "@/components/ui/Button";
import { addFriendValidator } from "@/libs/validations/add-friend";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { z, ZodError } from "zod";

interface AddFriendFormProps {}

type FormData = z.infer<typeof addFriendValidator>;

const AddFriendForm: FC<AddFriendFormProps> = ({}) => {
	const [showSuccessTrue, setShowSuccessTrue] = useState<boolean>(false);

	const { register, handleSubmit, setError, formState } = useForm<FormData>({
		resolver: zodResolver(addFriendValidator),
	});

	async function handleAddFriend(email: string) {
		try {
			const validatedEmail = addFriendValidator.parse({ email });
			await axios.post(`/api/friend/add`, {
				email: validatedEmail.email,
			});
			setShowSuccessTrue(true);
		} catch (error) {
			setShowSuccessTrue(false);
			if (error instanceof ZodError) {
				setError("email", { message: error.message });
				return;
			}
			if (error instanceof AxiosError) {
				setError("email", { message: error.response?.data });
				return;
			}
			setError("email", { message: "Something went wrong." });
		}
	}

	const onSubmit = (data: FormData) => {
		handleAddFriend(data.email);
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="w-full mt-4">
			<label
				htmlFor="email"
				className="text-sm font-medium text-gray-900 leading-6 block"
			>
				Add friend by E-mail
			</label>
			<div className="flex flex-row items-center gap-4 mt-3">
				<input
					{...register("email")}
					type="text"
					id="email"
					placeholder="you@example.com"
					className="block py-1.5 rounded-md h-12 w-full text-sm text-gray-900 shadow-sm border-0 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 leading-6 placeholder:text-gray-400 px-2"
				/>
				<Button size='lg'>Add</Button>
			</div>
			{showSuccessTrue && (
				<div className="mt-4 text-green-600 text-sm">
					Friend request sent successfully!
				</div>
			)}
			{formState.errors.email && (
				<div className="mt-2 text-red-600 text-sm">
					{formState.errors.email.message}
				</div>
			)}
		</form>
	);
};

export default AddFriendForm;
