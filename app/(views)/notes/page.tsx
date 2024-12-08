'use client'
import { useEffect, useState } from 'react'
import { useApp } from '@/contexts/AppContext'
import DocsPanel from '@/components/docs/DocsPanel'
import { useRouter } from 'next/navigation'

const NotesPage = () => {
  const { user, setUser } = useApp()
  const router = useRouter()
  const [currentTab, setCurrentTab] = useState<'public' | 'private'>(user?.id === 'public' ? 'public' : 'private')

  useEffect(() => {
    // Get tab from URL query parameter
    const params = new URLSearchParams(window.location.search)
    const tabFromUrl = params.get('type') as 'public' | 'private'
    
    if (tabFromUrl) {
      if (tabFromUrl === 'public') {
        setUser({ id: 'public', username: '' })
      } else if (user?.username) {
        // Only restore private if user is logged in
        setUser(user)
      }
      setCurrentTab(tabFromUrl)
    }
  }, [])

  return (
    <DocsPanel type={currentTab} />
  )
}

export default NotesPage
