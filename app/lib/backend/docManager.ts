import { readUserFile, saveUserFile, listUserFiles } from './userFiles'
import { FileItem } from '@/lib/types'
import path from 'path'
import { promises as fs } from 'fs'
import { USER_FILES_DIR } from '@/lib/constants'

export class DocumentManager {
  private userId: string

  constructor(userId: string) {
    this.userId = userId
  }

  async readDocument(filePath: string) {
    try {
      const content = await readUserFile(this.userId, filePath)
      if (!content) {
        return { error: '文档不存在', status: 404 }
      }
      return { content }
    } catch (error) {
      return { error: '读取文档失败', status: 500 }
    }
  }

  async saveDocument(filePath: string, content: string) {
    try {
      await saveUserFile(this.userId, filePath, content)
      return { success: true }
    } catch (error) {
      return { error: '保存文档失败', status: 500 }
    }
  }

  async listDocuments(subPath: string = '') {
    try {
      const files = await listUserFiles(this.userId, subPath)
      return { files }
    } catch (error) {
      return { error: '获取文件列表失败', status: 500 }
    }
  }

  validatePath(filePath: string): boolean {
    const normalizedPath = path.normalize(filePath)
    return !normalizedPath.includes('..')
  }

  async renameDocument(oldPath: string, newPath: string) {
    try {
      if (!this.validatePath(oldPath) || !this.validatePath(newPath)) {
        return { error: '无效的文件路径', status: 400 }
      }

      const oldFullPath = path.join(USER_FILES_DIR, this.userId, oldPath)
      const newFullPath = path.join(USER_FILES_DIR, this.userId, newPath)

      // 检查源文件是否存在
      try {
        await fs.access(oldFullPath)
      } catch {
        return { error: '源文件不存在', status: 404 }
      }

      // 检查目标文件是否已存在
      try {
        await fs.access(newFullPath)
        return { error: '目标文件已存在', status: 409 }
      } catch {
        // 目标文件不存在，可以继续
      }

      // 确保目标目录存在
      const newDirPath = path.dirname(newFullPath)
      await fs.mkdir(newDirPath, { recursive: true })

      // 执行重命名
      await fs.rename(oldFullPath, newFullPath)
      return { success: true }
    } catch (error) {
      console.error('重命名文件失败:', error)
      return { error: '重命名文件失败', status: 500 }
    }
  }
} 