'use client'
import { useEffect, useState } from 'react'
import { useApp } from '@/contexts/AppContext'
import DocsPanel from '@/components/docs/DocsPanel'
import { useRouter } from 'next/navigation'

const NotesPage = () => {
  const { user } = useApp()
  const router = useRouter()
  const [currentTab, setCurrentTab] = useState<'public' | 'private'>(user?.id ? 'private' : 'public')

  const handleTabChange = (tab: string) => {
    if (tab === 'private' && !user?.username) {
      router.push('/auth')
      return
    }
    setCurrentTab(tab as 'public' | 'private')
  }

  useEffect(() => {
    // Update tab when user auth state changes
    setCurrentTab(user?.id ? 'private' : 'public')
    console.log('user', user)
  }, [user?.id])

  return (
    <DocsPanel type={currentTab} />
  )
}

export default NotesPage
