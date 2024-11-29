`@/lib/userFiles.ts`
```ts
interface FileItem {
  name: string;
  type: 'file' | 'directory';
  path: string;
}

// 保存文件到用户目录
export const saveUserFile = async (userId: string, filePath: string, data: string): Promise<void>

// 从用户目录读取文件
export const readUserFile = async (userId: string, filePath: string): Promise<string | null>

// 获取用户目录下的文件和文件夹
export const listUserFiles = async (userId: string, subPath: string = ''): Promise<FileItem[]>
```