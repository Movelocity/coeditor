import { join } from 'path'

export const DATA_DIR = process.env.NODE_ENV === 'production' 
  ? '/var/tmp/notes-app' 
  : 'C:/tmp/notes-app'
  
export const USERS_FILE = join(DATA_DIR, 'users.json')
console.log("userfile", USERS_FILE)