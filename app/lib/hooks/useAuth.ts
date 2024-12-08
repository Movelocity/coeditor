import { useState, useEffect } from 'react'
import { checkAuth } from '@/lib/frontend/auth'
import { SimpleUser } from '@/lib/types'

export function useAuth() {
  const [user, setUser] = useState<SimpleUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const userData = await checkAuth()
        setUser(userData.id === 'public' ? null : userData)
        setIsLoading(false)
      } catch (error) {
        setUser(null)
        setIsLoading(false)
      }
    }
    verifyAuth()
  }, [])

  return { user, isLoading }
} 