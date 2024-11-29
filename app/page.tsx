'use client'

import { useState } from 'react'
import AuthForm from './components/auth/auth-form'

const NotesPage = () => {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const handleSuccess = () => {
    setIsAuthenticated(true)
  }

  if (!isAuthenticated) {
    return (
      <div className="space-y-8">
        <header className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">在线笔记</h1>
          <p className="mt-2 text-gray-600">请先登录或注册</p>
        </header>

        <AuthForm mode={mode} onSuccess={handleSuccess} />

        <div className="text-center">
          <button
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            className="text-indigo-600 hover:text-indigo-500"
          >
            {mode === 'login' ? '没有账号？点击注册' : '已有账号？点击登录'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <header className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">在线笔记</h1>
        <p className="mt-2 text-gray-600">记录您的想法和灵感</p>
      </header>
      
      <div className="grid gap-6 md:grid-cols-2">
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">公开笔记</h2>
          {/* 后续添加公开笔记列表组件 */}
        </section>
        
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">私人笔记</h2>
          {/* 后续添加私人笔记列表组件 */}
        </section>
      </div>
    </div>
  )
}

export default NotesPage
