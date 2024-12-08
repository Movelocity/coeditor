import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { ApiResponse } from '@/lib/types'

export async function POST() {
  try {
    const cookieStore = await cookies()
    cookieStore.delete('auth_token')
    
    const response: ApiResponse = {
      success: true
    }
    return NextResponse.json(response)
  } catch (error) {
    const response: ApiResponse = {
      error: '登出失败',
      status: 500
    }
    return NextResponse.json(response, { status: 500 })
  }
} 