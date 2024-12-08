import { useState, useEffect } from 'react'
import { checkAuth, logout } from '@/lib/frontend/auth'
import { SimpleUser } from '@/lib/types'

export function useAuth() {
  const [user, setUser] = useState<SimpleUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [showAuthModal, setShowAuthModal] = useState(false)

  useEffect(() => {
    checkAuth()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])

  const handleLogout = async () => {
    try {
      await logout()
      setUser(null)
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return {
    user,
    loading,
    showAuthModal,
    setShowAuthModal,
    setUser,
    logout: handleLogout,
    isAuthenticated: !!user && user.id !== 'public'
  }
} 