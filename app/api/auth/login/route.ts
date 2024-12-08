import { validateUser, generateToken } from '@/lib/backend/auth'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { ApiResponse, AuthResponse } from '@/lib/types'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()
    const user = await validateUser(email, password)

    if (!user) {
      const response: ApiResponse = {
        error: '用户名或密码错误',
        status: 401
      }
      return NextResponse.json(response, { status: 401 })
    }

    const token = generateToken(user.id)
    // 设置cookie
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
      error: '登录失败',
      status: 500
    }
    return NextResponse.json(response, { status: 500 })
  }
} 