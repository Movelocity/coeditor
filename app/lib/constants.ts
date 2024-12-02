import { join } from 'path'
import os from 'os'

export const DATA_DIR = os.platform() === 'win32' 
  ? 'C:/tmp/notes-app'
  : '/var/tmp/notes-app' 

export const JWT_SECRET = process.env.JWT_SECRET || 'development-secret'

export const USER_FILES_DIR = join(DATA_DIR, 'userFiles')

export const USERS_FILE = join(DATA_DIR, 'users.json')
// console.log("userfile", USERS_FILE)