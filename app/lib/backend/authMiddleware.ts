import { cookies } from 'next/headers'
import { verifyToken } from './auth'
import { NextResponse } from 'next/server'

export const authenticateUser = async () => {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth_token')?.value

  if (!token) {
    return null
  }

  const userId = verifyToken(token)
  return userId
}

export const unauthorized = () => {
  return NextResponse.json(
    { error: '未授权访问' },
    { status: 401 }
  )
} 