'use client'
import { useEffect, useState } from 'react'
import { useApp } from './contexts/AppContext'
import DocumentsEditor from '@/components/docs/DocumentsEditor'
import PageTransition from '@/components/PageTransition'
import Banner from '@/components/Banner'
import { useRouter } from 'next/navigation'

const NotesPage = () => {
  const { user } = useApp()
  const router = useRouter()
  const [currentTab, setCurrentTab] = useState<'public' | 'private'>(user?.id ? 'private' : 'public')

  const handleTabChange = (tab: string) => {
    if (tab === 'private' && !user?.id) {
      router.push('/auth')
      return
    }
    setCurrentTab(tab as 'public' | 'private')
    // console.log('tab changed to', tab)
  }

  useEffect(() => {
    // Update tab when user auth state changes
    setCurrentTab(user?.id ? 'private' : 'public')
  }, [user?.id])

  return (
    <PageTransition>
      <div className="px-4">
        <Banner 
          title="Online Editor"
          description="记录您的想法和灵感"
          username={user?.username}
          showTabs
          onTabChange={handleTabChange}
          defaultTab={currentTab}
          currentTab={currentTab}
        >
          <DocumentsEditor type={currentTab} />
        </Banner>
      </div>
    </PageTransition>
  )
}

export default NotesPage
