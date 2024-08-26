import { FC } from 'react'
import Skeleton from "react-loading-skeleton"
import 'react-loading-skeleton/dist/skeleton.css'
interface LoadingProps {
  
}

const Loading: FC<LoadingProps> = ({}) => {
    return <>
    <div className="hidden md:flex w-full gap-3 mx-6 md:mx-12 my-32 md:my-24 flex-col">
    <Skeleton className="mb-4" height={60} width={700} />
				<Skeleton height={40} width={400} />
				<Skeleton height={40} width={400} />
				<Skeleton height={40} width={400} />
    </div>
    <div className="flex md:hidden w-full gap-3 mx-6 md:mx-12 my-32 md:my-24 flex-col">
      <Skeleton className="mb-4" height={60} width={300} />
      <Skeleton height={50} width={280} />
      <Skeleton height={50} width={280} />
      <Skeleton height={50} width={280} />
    </div>
  </>
}

export default Loading