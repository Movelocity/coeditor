'use client'
import { useEffect } from 'react'
import { useApp } from './contexts/AppContext'
import DocumentsEditor from '@/components/docs/DocumentsEditor'
import PageTransition from '@/components/PageTransition'
import Banner from '@/components/Banner'
import { useRouter } from 'next/navigation'

const NotesPage = () => {
  const { user } = useApp()
  const router = useRouter()

  const handleTabChange = (tab: string) => {
    if (tab === 'private' && !user?.id) {
      router.push('/auth')
    }
  }

  return (
    <PageTransition>
      <div className="px-4">
        <Banner 
          title="Online Editor"
          description="记录您的想法和灵感"
          username={user?.username}
          showTabs
          onTabChange={handleTabChange}
          defaultTab="public"
        >
          <DocumentsEditor type={user?.id ? 'private' : 'public'} />
        </Banner>
      </div>
    </PageTransition>
  )
}

export default NotesPage
