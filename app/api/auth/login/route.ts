import { NextResponse } from 'next/server'
import { validateUser, generateToken } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json()
    
    if (!username || !password) {
      return NextResponse.json(
        { error: '用户名和密码不能为空' },
        { status: 400 }
      )
    }

    const user = await validateUser(username, password)
    
    if (!user) {
      return NextResponse.json(
        { error: '用户名或密码错误' },
        { status: 401 }
      )
    }

    const token = generateToken(user.id)
    const cookieStore = await cookies()
    
    cookieStore.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 // 7天
    })

    return NextResponse.json({ 
      user: { 
        id: user.id, 
        username: user.username 
      } 
    })
  } catch (error) {
    return NextResponse.json(
      { error: '登录失败' },
      { status: 500 }
    )
  }
} 