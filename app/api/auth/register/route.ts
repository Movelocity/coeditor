import { registerUser, generateToken } from '@/lib/backend/auth'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { ApiResponse, AuthResponse } from '@/lib/types'

export async function POST(request: Request) {
  try {
    const { email, username, password } = await request.json()
    const user = await registerUser(email, username, password)
    
    if (!user) {
      const response: ApiResponse = {
        error: '该邮箱或用户名已被注册',
        status: 400
      }
      return NextResponse.json(response, { status: 400 })
    }

    const token = generateToken(user.id)
    const cookieStore = await cookies()
    cookieStore.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7 // 7天
    })

    const response: ApiResponse<AuthResponse> = {
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          createdAt: user.createdAt
        },
        token
      },
      success: true
    }
    
    return NextResponse.json(response)
  } catch (error) {
    const response: ApiResponse = {
      error: '注册失败',
      status: 500
    }
    return NextResponse.json(response, { status: 500 })
  }
} 