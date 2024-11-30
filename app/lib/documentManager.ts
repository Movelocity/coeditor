import { readUserFile, saveUserFile, listUserFiles } from './userFiles'
import path from 'path'

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
} 