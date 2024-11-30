import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyToken, getUserById } from '@/lib/backend/auth_utils'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth_token')?.value
    if (!token) {
      return NextResponse.json({ user: null })
    }

    const userId = verifyToken(token)
    if (!userId) {
      return NextResponse.json({ user: null })
    }

    const user = await getUserById(userId)
    if (!user) {
      return NextResponse.json({ user: null })
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