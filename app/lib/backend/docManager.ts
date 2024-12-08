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
export class DocManager {
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

  /**
   * 获取文档或目录的详细信息
   * @param filePath - 文档或目录路径
   * @returns 包含文件信息的操作结果
   */
  async getDocumentInfo(filePath: string): Promise<OperationResult<FileItem>> {
    try {
      if (!this.validatePath(filePath)) {
        return { error: '无效的文件路径', status: 400 }
      }

      const fullPath = path.join(USER_FILES_DIR, this.userId, filePath)
      const stats = await fs.stat(fullPath)
      const isDirectory = stats.isDirectory()
      const name = path.basename(filePath)
      const suffix = !isDirectory ? name.split('.').pop() || '' : ''
      const nameWithoutSuffix = isDirectory ? name : name.slice(0, -(suffix.length ? suffix.length + 1 : 0))

      return {
        data: {
          name: nameWithoutSuffix,
          suffix,
          type: isDirectory ? 'directory' : 'file',
          path: filePath,
          createdAt: stats.birthtime.toISOString(),
          modifiedAt: stats.mtime.toISOString()
        }
      }
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        return { error: '文件或目录不存在', status: 404 }
      }
      return { error: '获取文件信息失败', status: 500 }
    }
  }

  /**
   * 创建新目录
   * @param dirPath - 目录路径
   * @returns 操作结果
   */
  async createDirectory(dirPath: string): Promise<OperationResult<void>> {
    try {
      if (!this.validatePath(dirPath)) {
        return { error: '无效的目录路径', status: 400 }
      }

      const fullPath = path.join(USER_FILES_DIR, this.userId, dirPath)

      // 检查目录是否已存在
      try {
        await fs.access(fullPath)
        return { error: '目录已存在', status: 409 }
      } catch {
        // 目录不存在，可以继续创建
      }

      await fs.mkdir(fullPath, { recursive: true })
      return { success: true }
    } catch (error) {
      const message = error instanceof Error ? error.message : '未知错误'
      return { error: `创建目录失败: ${message}`, status: 500 }
    }
  }

  /**
   * 删除文档或目录
   * @param targetPath - 要删除的文档或目录路径
   * @returns 操作结果
   */
  async deleteDocument(targetPath: string): Promise<OperationResult<void>> {
    try {
      if (!this.validatePath(targetPath)) {
        return { error: '无效的路径', status: 400 }
      }

      const fullPath = path.join(USER_FILES_DIR, this.userId, targetPath)
      
      // 检查文件/目录是否存在
      try {
        await fs.access(fullPath)
      } catch {
        return { error: '文件或目录不存在', status: 404 }
      }

      const stats = await fs.stat(fullPath)
      if (stats.isDirectory()) {
        await fs.rm(fullPath, { recursive: true })
      } else {
        await fs.unlink(fullPath)
      }

      return { success: true }
    } catch (error) {
      const message = error instanceof Error ? error.message : '未知错误'
      return { error: `删除失败: ${message}`, status: 500 }
    }
  }
} 