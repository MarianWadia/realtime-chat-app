import { getServerSession } from 'next-auth'
import { FC } from 'react'

interface HomePageProps {
  
}

const HomePage: FC<HomePageProps> = async ({}) => {
  const session = await getServerSession()
  return <div>Dashboard</div>
}

export default HomePage