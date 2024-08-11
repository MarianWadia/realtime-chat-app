import { authOptions } from '@/libs/auth'
import { getServerSession } from 'next-auth'
import { FC } from 'react'

interface HomePageProps {
  
}

const HomePage: FC<HomePageProps> = async ({}) => {
  const session = await getServerSession(authOptions)
  console.log(session)
  return <div>{JSON.stringify(session)}</div>
}

export default HomePage