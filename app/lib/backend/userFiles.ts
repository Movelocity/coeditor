import { promises as fs } from 'fs';
import { join, dirname } from 'path';
import { USER_FILES_DIR } from '@/lib/constants';
import { FileItem } from '@/lib/types';

/**
 * 文件操作错误类型
 */
export class FileOperationError extends Error {
  constructor(message: string, public code: number = 500) {
    super(message);
    this.name = 'FileOperationError';
  }
}

/**
 * 保存文件到用户目录
 * @param userId - 用户ID
 * @param filePath - 相对于用户目录的文件路径
 * @param data - 要保存的文件内容
 * @throws {FileOperationError} 当文件操作失败时抛出
 */
export const saveUserFile = async (userId: string, filePath: string, data: string): Promise<void> => {
  const fullPath = join(USER_FILES_DIR, userId, filePath);
  const dirPath = join(USER_FILES_DIR, userId, dirname(filePath));
  
  try {
    await fs.mkdir(dirPath, { recursive: true });
    await fs.writeFile(fullPath, data, 'utf8');
  } catch (error) {
    const message = error instanceof Error ? error.message : '未知错误';
    throw new FileOperationError(`保存文件失败: ${message}`, 500);
  }
};

/**
 * 从用户目录读取文件
 * @param userId - 用户ID
 * @param filePath - 相对于用户目录的文件路径
 * @returns 文件内容
 * @throws {FileOperationError} 当文件不存在或读取失败时抛出
 */
export const readUserFile = async (userId: string, filePath: string): Promise<string> => {
  const fullPath = join(USER_FILES_DIR, userId, filePath);
  try {
    return await fs.readFile(fullPath, 'utf8');
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      throw new FileOperationError('文件不存在', 404);
    }
    const message = error instanceof Error ? error.message : '未知错误';
    throw new FileOperationError(`读取文件失败: ${message}`, 500);
  }
};

/**
 * 获取用户目录下的所有文件和文件夹
 * @param userId - 用户ID
 * @param subPath - 子目录路径（可选）
 * @returns 文件和目录列表
 * @throws {FileOperationError} 当目录不存在或无法访问时抛出
 */
export const listUserFiles = async (userId: string, subPath: string = ''): Promise<FileItem[]> => {
  const dirPath = join(USER_FILES_DIR, userId, subPath);
  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    return await Promise.all(
      entries.map(async (entry) => {
        const isDirectory = entry.isDirectory();
        const suffix = !isDirectory ? entry.name.split('.').pop() || '' : '';
        const nameWithoutSuffix = isDirectory ? entry.name : entry.name.slice(0, -(suffix.length ? suffix.length + 1 : 0));
        
        return {
          name: nameWithoutSuffix,
          suffix,
          type: isDirectory ? 'directory' : 'file',
          path: join(subPath, entry.name)
        };
      })
    );
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      throw new FileOperationError('目录不存在', 404);
    }
    const message = error instanceof Error ? error.message : '未知错误';
    throw new FileOperationError(`列出文件失败: ${message}`, 500);
  }
};
