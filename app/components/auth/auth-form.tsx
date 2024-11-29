'use client'
import { useState } from 'react'
import { LoginForm } from '@/lib/types'
import cn from "classnames"

type AuthFormProps = {
  mode: 'login' | 'register'
  onSuccess: (user: any) => void
}

const AuthForm = ({ mode, onSuccess }: AuthFormProps) => {
  const [form, setForm] = useState<LoginForm>({ username: '', password: '' })
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch(`/api/auth/${mode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error)
      }

      onSuccess(data.user)
    } catch (err) {
      setError(err instanceof Error ? err.message : '操作失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto">
      <div>
        <label htmlFor="username" className="block text-sm font-medium">
          用户名
        </label>
        <input
          id="username"
          type="text"
          value={form.username}
          onChange={e => setForm(prev => ({ ...prev, username: e.target.value }))}
          className="w-full decoration-none outline-none font-sans p-1 text-black"
          required
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium">
          密码
        </label>
        <input
          id="password"
          type="password"
          value={form.password}
          onChange={e => setForm(prev => ({ ...prev, password: e.target.value }))}
          className="w-full decoration-none outline-none font-sans p-1 text-black"
          required
        />
      </div>

      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}

      <button
        type="submit"
        disabled={loading}
        className={cn("w-full flex justify-center py-2 px-4  rounded-md", mode === 'login' ? 'hover:bg-zinc-600' : 'hover:bg-slate-600')}
      >
        {loading ? '处理中...' : mode === 'login' ? '登录' : '注册'}
      </button>
    </form>
  )
}

export default AuthForm 