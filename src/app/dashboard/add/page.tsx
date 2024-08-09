import AddFriendForm from '@/components/dashboard/add/addFriendForm'
import { FC } from 'react'

interface pageProps {
  
}

const AddDashboardPage: FC<pageProps> = ({}) => {
  return <main className='sm:max-w-sm md:max-w-xl'>
    <div className='mx-4 md:mx-12 my-24 flex flex-col'>
        <h1 className='text-5xl font-extrabold text-gray-800'>Add a friend</h1>
        <AddFriendForm />
    </div>
  </main>
}

export default AddDashboardPage