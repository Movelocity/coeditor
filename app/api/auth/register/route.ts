import { NextResponse } from 'next/server'
import { registerUser } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json()
    
    if (!username || !password) {
      return NextResponse.json(
        { error: '用户名和密码不能为空' },
        { status: 400 }
      )
    }

    const user = await registerUser(username, password)
    
    if (!user) {
      return NextResponse.json(
        { error: '用户名已存在' },
        { status: 409 }
      )
    }

    return NextResponse.json({ user })
  } catch (error) {
    return NextResponse.json(
      { error: '注册失败' },
      { status: 500 }
    )
  }
} 