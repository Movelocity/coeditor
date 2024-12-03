import { promises as fs } from 'fs';
import { join, dirname } from 'path';
import { USER_FILES_DIR } from '@/lib/constants';
import { FileItem } from '@/lib/types';


// 创建用户目录
// const createUserDirectory = async (userId: string): Promise<void> => {
//   const userDir = join(USER_FILES_DIR, userId);
//   try {
//     await fs.mkdir(userDir, { recursive: true });
//   } catch (error) {
//     console.error(`无法创建用户目录: ${error}`);
//   }
// };

// 保存文件到用户目录
export const saveUserFile = async (userId: string, filePath: string, data: string): Promise<void> => {
  const fullPath = join(USER_FILES_DIR, userId, filePath);
  const dirPath = join(USER_FILES_DIR, userId, dirname(filePath));
  
  try {
    await fs.mkdir(dirPath, { recursive: true });
    await fs.writeFile(fullPath, data, 'utf8');
  } catch (error) {
    console.error(`无法保存文件: ${error}`);
  }
};

// 从用户目录读取文件
export const readUserFile = async (userId: string, filePath: string): Promise<string | null> => {
  const fullPath = join(USER_FILES_DIR, userId, filePath);
  try {
    const data = await fs.readFile(fullPath, 'utf8');
    return data;
  } catch (error) {
    console.error(`无法读取文件: ${error}`);
    return null;
  }
};

// 获取用户目录下的所有文件和文件夹
export const listUserFiles = async (userId: string, subPath: string = ''): Promise<FileItem[]> => {
  const dirPath = join(USER_FILES_DIR, userId, subPath);
  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    const files: FileItem[] = await Promise.all(
      entries.map(async (entry) => {
        const isDirectory = entry.isDirectory();
        const suffix = !isDirectory ? entry.name.split('.').pop() || '' : '';
        const suffix_length = suffix.length==0?0:suffix.length+1;
        return {
          name: entry.name.slice(0, -suffix_length),
          suffix,
          type: isDirectory ? 'directory' : 'file',
          path: join(subPath, entry.name)
        };
      })
    );
    return files;
  } catch (error) {
    console.error(`无法列出文件: ${error}`);
    return [];
  }
};
