import { FC } from 'react'
import Skeleton from "react-loading-skeleton"
import 'react-loading-skeleton/dist/skeleton.css'

interface LoadingProps {
  
}

const Loading: FC<LoadingProps> = ({}) => {
  return <div className='w-full gap-3 mx-4 md:mx-12 my-24 flex flex-col'>
    <Skeleton className="mb-4" height={60} width={500} />
    <Skeleton height={50} width={350} />
    <Skeleton height={50} width={350} />
    <Skeleton height={50} width={350} />
  </div>
}

export default Loading