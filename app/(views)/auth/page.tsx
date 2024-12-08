'use client'
import { useState } from 'react'
import { useApp } from '@/contexts/AppContext'
import { redirect } from 'next/navigation'
const AuthPage = () => {
  const { setUser, user } = useApp()
  const [mode, setMode] = useState<'login' | 'register'>('login')

  if(user && user.username) {
    redirect('/')
  }

  return (
    <div>
      <h1>Auth</h1>
    </div>
  )
}

export default AuthPage