'use client'
import { useState } from 'react'
import AuthForm from './components/auth/auth-form'
import { useApp } from './contexts/AppContext'
import LogoutButton from "@/components/auth/LogoutButton"

const NotesPage = () => {
  const { user, setUser } = useApp()
  const [mode, setMode] = useState<'login' | 'register'>('login')

  const handleSuccess = (userData: any) => {
    setUser(userData)
  }

  if (!user) {
    return (
      <div className="space-y-8 text-gray-200">
        <header className="text-center">
          <h1 className="text-3xl font-bold">Online Editor</h1>
          <p className="mt-2">请先登录或注册</p>
        </header>

        <AuthForm mode={mode} onSuccess={handleSuccess} />
        
        <div className="text-center">
          {mode === 'login' ? '没有账号？' : '已有账号？'}
          <button
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
          >
            {mode === 'login' ? '点击注册' : '点击登录'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 text-gray-300 px-4">
      <header className="text-center">
        <h1 className="text-3xl font-bold">Online Editor</h1>
        <p className="mt-2">记录您的想法和灵感</p>
      </header>
      
      <div className="grid gap-6 md:grid-cols-2">
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Public Notes</h2>
          {/* 后续添加公开笔记列表组件 */}
        </section>
        
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Private Notes</h2>
          {/* 后续添加私人笔记列表组件 */}
        </section>
      </div>

      <LogoutButton />
    </div>
  )
}

export default NotesPage
