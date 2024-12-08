'use client'
import { useState } from 'react'
import AuthForm from '@/components/auth/auth-form'
import { useApp } from '@/contexts/AppContext'
import Banner from '@/components/Banner'
import { redirect } from 'next/navigation'
const AuthPage = () => {
  const { setUser, user } = useApp()
  const [mode, setMode] = useState<'login' | 'register'>('login')

  const handleSuccess = (userData: any) => {
    setUser(userData)
  }

  const handleToggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login')
  }

  if(user && user.username) {
    redirect('/')
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center py-8 px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 shadow-2xl space-y-6">
          <div className="flex justify-center space-x-4 mb-6">
            <button
              onClick={() => setMode('login')}
              className={`px-4 py-2 rounded-lg transition-all ${
                mode === 'login'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              登录
            </button>
            <button
              onClick={() => setMode('register')}
              className={`px-4 py-2 rounded-lg transition-all ${
                mode === 'register'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              注册
            </button>
          </div>

          <AuthForm mode={mode} onSuccess={handleSuccess} />
          
          <p className="text-center text-sm text-gray-400">
            {mode === 'login' ? '还没有账号？' : '已经有账号？'}
            <button
              onClick={handleToggleMode}
              className="ml-2 text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              {mode === 'login' ? '立即注册' : '立即登录'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default AuthPage