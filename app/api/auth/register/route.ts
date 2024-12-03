import { registerUser, generateToken, createAuthResponse, createErrorResponse } from '@/lib/backend/auth'
import { cookies } from 'next/headers'
export async function POST(request: Request) {
  try {
    const { email, username, password } = await request.json()
    const user = await registerUser(email, username, password)
    
    if (!user) {
      return createErrorResponse('该邮箱或用户名已被注册', 400)
    }

    const token = generateToken(user.id)
    const cookieStore = await cookies()
    cookieStore.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7 // 7天
    })
    // return createAuthResponse({ user, token })
    return createAuthResponse({ id: user.id, username: user.username, token })
  } catch (error) {
    return createErrorResponse('注册失败', 500)
  }
} 