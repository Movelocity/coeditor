import { NextRequest } from 'next/server'
import { validateAuthToken, createAuthResponse, createErrorResponse } from '@/lib/backend/auth'
import { DocumentManager } from '@/lib/backend/docManager'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string; path: string[] }> }
) {
  const { userId: originalUserId, path } = await params
  const searchParams = request.nextUrl.searchParams
  const mode = searchParams.get('mode') || 'private'

  const userId = mode === 'public' ? 'public' : originalUserId

  if (mode !== 'public') {
    const authUserId = await validateAuthToken()
    if (!authUserId || authUserId !== originalUserId) {
      return createErrorResponse('未授权访问', 401)
    }
  }

  const docManager = new DocumentManager(userId)
  const filePath = path.join('/')

  if (!docManager.validatePath(filePath)) {
    return createErrorResponse('无效的文件路径', 400)
  }

  const result = await docManager.readDocument(filePath)
  if ('error' in result) {
    return createErrorResponse(result.error??"err", result.status)
  }

  return createAuthResponse(result)
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string; path: string[] }> }
) {
  const { userId: originalUserId, path } = await params
  const searchParams = request.nextUrl.searchParams
  const mode = searchParams.get('mode') || 'private'

  const userId = mode === 'public' ? 'public' : originalUserId

  if (mode !== 'public') {
    const authUserId = await validateAuthToken()
    if (!authUserId || authUserId !== originalUserId) {
      return createErrorResponse('未授权访问', 401)
    }
  }

  try {
    const { content } = await request.json()
    if (!content) {
      return createErrorResponse('内容不能为空', 400)
    }

    const docManager = new DocumentManager(userId)
    const filePath = path.join('/')

    if (!docManager.validatePath(filePath)) {
      return createErrorResponse('无效的文件路径', 400)
    }

    const result = await docManager.saveDocument(filePath, content)
    if ('error' in result) {
      return createErrorResponse(result.error??"err", result.status)
    }

    return createAuthResponse(result)
  } catch (error) {
    return createErrorResponse('请求处理失败', 500)
  }
}