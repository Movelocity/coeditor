'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

const Home = () => {
  const router = useRouter()

  useEffect(() => {
    // Update tab when user auth state changes
    router.push('/notes')
  }, [])

  return (
    <div>Home</div>
  )
}

export default Home
