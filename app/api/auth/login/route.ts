import { validateUser, generateToken, createAuthResponse, createErrorResponse } from '@/lib/backend/auth'
import { cookies } from 'next/headers'
export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()
    const user = await validateUser(email, password)
    // console.log("login: ", user, email, password)
    if (!user) {
      return createErrorResponse('用户名或密码错误', 401)
    }

    const token = generateToken(user.id)
    // 设置cookie
    const cookieStore = await cookies()
    cookieStore.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7 // 7天
    })
    return createAuthResponse({ id: user.id, username: user.username, token })
  } catch (error) {
    return createErrorResponse('登录失败', 500)
  }
} 