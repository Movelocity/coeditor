import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyToken, getUserById } from '@/lib/backend/auth'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth_token')?.value

    if (!token) {
      return NextResponse.json({ id: 'public', username: '' })
    }

    const userId = verifyToken(token)
    if (!userId) {
      return NextResponse.json(
        { error: '无效的认证令牌' },
        { status: 401 }
      )
    }

    const user = await getUserById(userId)
    if (!user) {
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      id: user.id,
      username: user.username
    })
  } catch (error) {
    return NextResponse.json(
      { error: '验证失败' },
      { status: 500 }
    )
  }
} 