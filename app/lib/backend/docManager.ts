import { readUserFile, saveUserFile, listUserFiles, FileOperationError } from './userFiles'
import { FileItem } from '@/lib/types'
import path from 'path'
import { promises as fs } from 'fs'
import { USER_FILES_DIR } from '@/lib/constants'

/**
 * 文档操作结果类型
 */
type OperationResult<T> = {
  data?: T;
  error?: string;
  status?: number;
  success?: boolean;
}

/**
 * 文档管理器类
 * 负责处理用户文档的读取、保存、列表和重命名等操作
 */
export class DocumentManager {
  private userId: string

  /**
   * 创建文档管理器实例
   * @param userId - 用户ID
   */
  constructor(userId: string) {
    this.userId = userId
  }

  /**
   * 读取文档内容
   * @param filePath - 文档路径
   * @returns 包含文档内容或错误信息的操作结果
   */
  async readDocument(filePath: string): Promise<OperationResult<string>> {
    try {
      if (!this.validatePath(filePath)) {
        return { error: '无效的文件路径', status: 400 }
      }
      const content = await readUserFile(this.userId, filePath)
      return { data: content }
    } catch (error) {
      if (error instanceof FileOperationError) {
        return { error: error.message, status: error.code }
      }
      return { error: '读取文档失败', status: 500 }
    }
  }

  /**
   * 保存文档内容
   * @param filePath - 文档路径
   * @param content - 文档内容
   * @returns 操作结果
   */
  async saveDocument(filePath: string, content: string): Promise<OperationResult<void>> {
    try {
      if (!this.validatePath(filePath)) {
        return { error: '无效的文件路径', status: 400 }
      }
      await saveUserFile(this.userId, filePath, content)
      return { success: true }
    } catch (error) {
      if (error instanceof FileOperationError) {
        return { error: error.message, status: error.code }
      }
      return { error: '保存文档失败', status: 500 }
    }
  }

  /**
   * 列出指定路径下的所有文档
   * @param subPath - 子目录路径（可选）
   * @returns 包含文件列表的操作结果
   */
  async listDocuments(subPath: string = ''): Promise<OperationResult<FileItem[]>> {
    try {
      if (!this.validatePath(subPath)) {
        return { error: '无效的目录路径', status: 400 }
      }
      const files = await listUserFiles(this.userId, subPath)
      return { data: files }
    } catch (error) {
      if (error instanceof FileOperationError) {
        return { error: error.message, status: error.code }
      }
      return { error: '获取文件列表失败', status: 500 }
    }
  }

  /**
   * 验证文件路径是否安全
   * @param filePath - 要验证的文件路径
   * @returns 路径是否安全
   */
  private validatePath(filePath: string): boolean {
    const normalizedPath = path.normalize(filePath)
    return !normalizedPath.includes('..')
  }

  /**
   * 重命名文档
   * @param oldPath - 原文件路径
   * @param newPath - 新文件路径
   * @returns 操作结果
   */
  async renameDocument(oldPath: string, newPath: string): Promise<OperationResult<void>> {
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
      const message = error instanceof Error ? error.message : '未知错误'
      return { error: `重命名文件失败: ${message}`, status: 500 }
    }
  }
} 