import { writeFile, readFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { User } from './types'
import { v4 as uuidv4 } from 'uuid'

const DATA_DIR = process.env.NODE_ENV === 'production' 
  ? '/var/tmp/notes-app' 
  : 'C:/tmp/notes-app'

const USERS_FILE = join(DATA_DIR, 'users.json')
console.log("userfile", USERS_FILE)

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

export const registerUser = async (username: string, password: string): Promise<User | null> => {
  console.log('registerUser', username, password)
  const users = await readUsers()
  
  if (users.some(user => user.username === username)) {
    return null
  }

  const newUser: User = {
    id: uuidv4(),
    username,
    password, // 实际项目中应该加密
    createdAt: new Date().toISOString()
  }

  users.push(newUser)
  console.log('users', users)
  await saveUsers(users)
  return newUser
}

export const validateUser = async (username: string, password: string): Promise<User | null> => {
  const users = await readUsers()
  return users.find(user => user.username === username && user.password === password) || null
} 