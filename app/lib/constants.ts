import { join } from 'path'

export const DATA_DIR = process.env.NODE_ENV === 'production' 
  ? '/var/tmp/notes-app' 
  : 'C:/tmp/notes-app'

export const JWT_SECRET = process.env.JWT_SECRET || 'development-secret'

export const USER_FILES_DIR = join(DATA_DIR, 'userFiles')

export const USERS_FILE = join(DATA_DIR, 'users.json')
// console.log("userfile", USERS_FILE)