type AuthResponse = {
  user: {
    id: string
    username: string
    email: string
    createdAt: string
  }
  token: string
}

export const login = async (email: string, username: string, password: string): Promise<AuthResponse> => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || '登录失败')
  }

  return response.json()
}

export const register = async (email: string, username: string, password: string): Promise<AuthResponse> => {
  const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, username, password }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || '注册失败')
  }

  return response.json()
} 