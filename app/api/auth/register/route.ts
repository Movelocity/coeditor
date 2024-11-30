import { registerUser, generateToken } from '@/lib/backend/auth_utils'
import { createAuthResponse, createErrorResponse } from '@/lib/backend/auth_utils'

export async function POST(request: Request) {
  try {
    const { email, username, password } = await request.json()
    const user = await registerUser(email, username, password)
    
    if (!user) {
      return createErrorResponse('该邮箱或用户名已被注册', 400)
    }

    const token = generateToken(user.id)
    return createAuthResponse({ user, token })
  } catch (error) {
    return createErrorResponse('注册失败', 500)
  }
} 