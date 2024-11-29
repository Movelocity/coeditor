import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getUserById } from '@/lib/auth'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const userId = cookieStore.get('user_id')?.value

    if (!userId) {
      return NextResponse.json({ user: null })
    }

    const user = await getUserById(userId)
    if (!user) {
      return NextResponse.json({ user: null })
    }

    // 不返回密码
    const { password, ...safeUser } = user
    return NextResponse.json({ user: safeUser })
  } catch (error) {
    return NextResponse.json(
      { error: '验证失败' },
      { status: 500 }
    )
  }
} 