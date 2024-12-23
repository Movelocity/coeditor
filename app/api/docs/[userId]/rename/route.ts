import { NextRequest } from 'next/server'
import { validateAuthToken, createAuthResponse, createErrorResponse } from '@/lib/backend/auth'
import { DocumentManager } from '@/lib/backend/docManager'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  let { userId } = await params
  const searchParams = request.nextUrl.searchParams
  const mode = searchParams.get('mode') || 'private'
  
  if (mode !== 'public') {
    const authUserId = await validateAuthToken()
    if (!authUserId || authUserId !== userId) {
      return createErrorResponse('未授权访问', 401)
    }
  } else {
    userId = 'public'
  }

  try {
    const { oldPath, newPath } = await request.json()
    if (!oldPath || !newPath) {
      return createErrorResponse('缺少必要参数', 400)
    }

    const docManager = new DocumentManager(userId)
    const result = await docManager.renameDocument(oldPath, newPath)
    
    if ('error' in result) {
      return createErrorResponse(result.error ?? '重命名失败', result.status)
    }

    return createAuthResponse(result)
  } catch (error) {
    console.error('重命名文件失败:', error)
    return createErrorResponse('请求处理失败', 500)
  }
} 