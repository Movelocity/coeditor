import { join } from 'path'
import os from 'os'

// 前后端共享的常量
/**
 * API请求的基础路径
 */
export const API_BASE_PATH: string = '/coeditor/api'


// 后端使用的常量
/**
 * 应用数据存储的根目录
 * Windows: C:/tmp/notes-app
 * Other: /var/tmp/notes-app
 */
export const DATA_DIR: string = os.platform() === 'win32' 
  ? 'C:/tmp/notes-app'
  : '/var/tmp/notes-app' 

/**
 * JWT签名密钥
 * 生产环境应该通过环境变量配置
 */
export const JWT_SECRET: string = process.env.JWT_SECRET || 'development-secret'

/**
 * 用户文件存储目录
 */
export const USER_FILES_DIR: string = join(DATA_DIR, 'userFiles')

/**
 * 用户数据存储文件路径
 */
export const USERS_FILE: string = join(DATA_DIR, 'users.json')