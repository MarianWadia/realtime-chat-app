import { authOptions } from '@/libs/auth'
import { getServerSession } from 'next-auth'
import { FC } from 'react'

interface HomePageProps {
  
}

const HomePage: FC<HomePageProps> = async ({}) => {
  const session = await getServerSession(authOptions)
  console.log('session', session)
  return <div></div>
}

export default HomePage