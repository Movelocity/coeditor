import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyToken, getUserById } from '@/lib/backend/auth'
import { ApiResponse, SimpleUser } from '@/lib/types'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth_token')?.value

    if (!token) {
      const response: ApiResponse<SimpleUser> = {
        data: { id: 'public', username: '' },
        success: true
      }
      return NextResponse.json(response)
    }

    const userId = verifyToken(token)
    if (!userId) {
      const response: ApiResponse = {
        error: '无效的认证令牌',
        status: 401
      }
      return NextResponse.json(response, { status: 401 })
    }

    const user = await getUserById(userId)
    if (!user) {
      const response: ApiResponse = {
        error: '用户不存在',
        status: 401
      }
      return NextResponse.json(response, { status: 401 })
    }

    const response: ApiResponse<SimpleUser> = {
      data: {
        id: user.id,
        username: user.username
      },
      success: true
    }
    return NextResponse.json(response)
  } catch (error) {
    const response: ApiResponse = {
      error: '验证失败',
      status: 500
    }
    return NextResponse.json(response, { status: 500 })
  }
} 