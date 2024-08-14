"use client"
import Button from '@/components/ui/Button'
import { Loader2, LogOut } from 'lucide-react'
import { signOut } from 'next-auth/react'
import { ButtonHTMLAttributes, FC, useState } from 'react'
import toast from 'react-hot-toast'

interface LogoutButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  
}

const LogoutButton: FC<LogoutButtonProps> = ({...props}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  return <Button {...props} variant='ghost' onClick={async()=>{
    try {
      setIsLoading(true)
      await signOut()
    } catch (error) {
      toast.error('There was a problem in sign-out')
    }finally{
      setIsLoading(false)
    }
  }}>
    {isLoading ? <Loader2 size={22} className='animate-spin' /> : <LogOut size={22} />}
  </Button>
}

export default LogoutButton