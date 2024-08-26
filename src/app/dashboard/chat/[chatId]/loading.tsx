import { cn } from "@/libs/utils";
import { FC } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface LoadingProps {}

const Loading: FC<LoadingProps> = ({}) => {
	return (
		<div className="w-full h-full flex flex-1 justify-between flex-col py-12 px-8">
			<div className="w-full flex flex-row border-b-[1px] border-b-gray-200 gap-6 pb-4">
				<div className="relative h-8 w-8 md:h-12 md:w-12">
					<Skeleton
						className="rounded-full"
						width={50}
						height={50}
						borderRadius={999}
					/>
				</div>
				<div className="flex flex-col">
					<Skeleton
						className="text-xl leading-6 font-semibold text-gray-800 capitalize"
						width={200}
						height={20}
					/>
					<Skeleton className="text-sm text-gray-400" width={250} height={20} />
				</div>
			</div>

			<div
				id="messages"
				className="flex-1 flex flex-col-reverse gap-4 p-3 max-h-[calc(100vh-6rem)] overflow-y-auto w-full my-8 scrollbar-w-2 scrollbar-thumb-green scrollbar-track-green-lighter scrolling-touch scrollbar-thumb-rounded"
			>
				<div className="col-start-1 justify-end self-end p-3 rounded-lg">
					<div className="flex flex-row-reverse items-center">
						<div className="relative h-10 w-10">
							<Skeleton width={40} height={40} borderRadius={999} />
						</div>
						<div className="relative mr-3 text-sm bg-white py-2 px-4 border border-gray-100 rounded-xl">
							<Skeleton className="mr-2" width={150} height={20} />
						</div>
					</div>
				</div>
				<div className="col-start-1 col-end-8 p-3 rounded-lg">
					<div className="flex flex-row items-center">
						<div className="relative h-10 w-10">
							<Skeleton width={40} height={40} borderRadius={999} />
						</div>
						<div className="relative ml-3 text-sm bg-white py-2 px-4 border border-gray-100 rounded-xl">
							<Skeleton className="ml-2" width={150} height={20} />
						</div>
					</div>
				</div>

				<div className="col-start-1 justify-end self-end p-3 rounded-lg">
					<div className="flex flex-row-reverse items-center">
						<div className="relative h-10 w-10">
							<Skeleton width={40} height={40} borderRadius={999} />
						</div>
						<div className="relative mr-3 text-sm bg-white py-2 px-4 border border-gray-100 rounded-xl">
							<Skeleton className="mr-2" width={150} height={20} />
						</div>
					</div>
				</div>
			</div>

			<div className="w-full border-t-[1px] border-t-gray-200 pt-4">
				<Skeleton
					className="border-none outline-none border-0 outline-0 resize-none bg-transparent border-transparent outline-transparent w-full placeholder:text-gray-400 placeholder:font-light text-gray-900 focus:ring-0 sm:text-sm"
					width={900}
					height={100}
				/>
			</div>
		</div>
	);
};

export default Loading;
