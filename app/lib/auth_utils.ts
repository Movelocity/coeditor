import { cookies } from 'next/headers'
import { verifyToken } from './auth'
import { NextResponse } from 'next/server'

export const getAuthToken = async () => {
  const cookieStore = await cookies()
  return cookieStore.get('auth_token')?.value
}

export const validateAuthToken = async () => {
  const token = await getAuthToken()
  if (!token) return null
  return verifyToken(token)
}

export const createAuthResponse = (data: any, status: number = 200) => {
  return NextResponse.json(data, { status })
}

export const createErrorResponse = (message: string, status: number = 400) => {
  return NextResponse.json({ error: message }, { status })
}
