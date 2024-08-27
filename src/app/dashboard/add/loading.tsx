import { FC } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface LoadingProps {}

const Loading: FC<LoadingProps> = ({}) => {
	return (
		<>
			<div className="hidden md:flex w-full overflow-x-hidden overflow-y-hidden gap-3 mx-6 md:mx-12 my-32 md:my-24 flex-col">
				<Skeleton className="mb-4" height={60} width={500} />
				<Skeleton height={35} width={250} />
				<Skeleton height={50} width={350} />
			</div>
      <div className="flex md:hidden w-full overflow-x-hidden overflow-y-hidden gap-3 mx-6 md:mx-12 my-32 md:my-24 flex-col">
				<Skeleton className="mb-4" height={60} width={360} />
				<Skeleton height={20} width={150} />
				<Skeleton height={50} width={250} />
			</div>
		</>
	);
};

export default Loading;
