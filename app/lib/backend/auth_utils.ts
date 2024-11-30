import { cookies } from 'next/headers'
// import { verifyToken } from '@/lib/auth'
import { sign, verify } from 'jsonwebtoken'
import { NextResponse } from 'next/server'
import { JWT_SECRET } from '../constants'

import { writeFile, readFile, mkdir } from 'fs/promises'

import { User } from '../types'
import { DATA_DIR, USERS_FILE } from '../constants'
import crypto from 'crypto'

// 确保数据目录存在
const ensureDataDir = async () => {
  try {
    await mkdir(DATA_DIR, { recursive: true })
  } catch (error) {
    // 如果目录已存在，忽略错误
    if ((error as NodeJS.ErrnoException).code !== 'EEXIST') {
      throw error
    }
  }
}

// 工具函数：读取用户数据
const readUsers = async (): Promise<User[]> => {
  
  try {
    await ensureDataDir()
    const data = await readFile(USERS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    // 如果文件不存在，返回空数组
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return []
    }
    throw error
  }
}

// 工具函数：保存用户数据
const saveUsers = async (users: User[]) => {
  await ensureDataDir()
  await writeFile(USERS_FILE, JSON.stringify(users, null, 2))
}

// 添加环境变量类型声明
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      SUPER_USER_USERNAME: string
      SUPER_USER_PASSWORD: string
    }
  }
}

// 添加超级用户验证函数
const validateSuperUser = (username: string, password: string): boolean => {
  return username === process.env.SUPER_USER_USERNAME && 
         password === process.env.SUPER_USER_PASSWORD
}

// Add password hashing functions
const hashPassword = (password: string): string => {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex')
  return `${salt}:${hash}`
}

const verifyPassword = (password: string, hashedPassword: string): boolean => {
  const [salt, storedHash] = hashedPassword.split(':')
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex')
  return storedHash === hash
}

// Simple ID generation function
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

export const registerUser = async (email: string, username: string, password: string): Promise<User | null> => {
  const users = await readUsers()
  
  if (users.some(user => user.email === email || user.username === username)) {
    return null
  }

  const newUser: User = {
    id: generateId(),
    email,
    username,
    password: hashPassword(password),
    createdAt: new Date().toISOString()
  }

  users.push(newUser)
  await saveUsers(users)
  
  // Don't return password in response
  const { password: _, ...userWithoutPassword } = newUser
  return userWithoutPassword as User
}

// 修改 validateUser 函数
export const validateUser = async (email: string, password: string): Promise<User | null> => {
  const users = await readUsers()
  const user = users.find(user => user.email === email)
  
  if (!user || !verifyPassword(password, user.password)) {
    return null
  }
  
  // Don't return password in response
  const { password: _, ...userWithoutPassword } = user
  return userWithoutPassword as User
}

// 修改 getUserById 函数
export const getUserById = async (userId: string): Promise<User | null> => {
  const users = await readUsers()
  const user = users.find(user => user.id === userId)
  
  if (!user) return null
  
  // Don't return password in response
  const { password: _, ...userWithoutPassword } = user
  return userWithoutPassword as User
} 

// 添加生成token的函数
export const generateToken = (userId: string): string => {
  return sign({ userId }, JWT_SECRET, { expiresIn: '7d' })
}

// 添加验证token的函数
export const verifyToken = (token: string): string | null => {
  try {
    const decoded = verify(token, JWT_SECRET) as { userId: string }
    return decoded.userId
  } catch {
    return null
  }
}

export const getAuthToken = async () => {
  const cookieStore = await cookies()
  return cookieStore.get('auth_token')?.value
}

export const validateAuthToken = async () => {
  const token = await getAuthToken()
  if (!token) return null
  return verifyToken(token)
}

export const createAuthResponse = (data: any, status: number = 200) => {
  return NextResponse.json(data, { status })
}

export const createErrorResponse = (message: string, status: number = 400) => {
  return NextResponse.json({ error: message }, { status })
}
