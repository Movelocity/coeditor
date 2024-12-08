import { NextRequest, NextResponse } from 'next/server'
import { authenticateUser, unauthorized } from '@/lib/backend/auth'
import { DocManager } from '@/lib/backend/docManager'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params
  if (userId !== 'public') {
    const authUserId = await authenticateUser()
    if (!authUserId || authUserId !== userId) {
      return unauthorized()
    }
  }

  const searchParams = request.nextUrl.searchParams
  const path = searchParams.get('path') || ''

  try {
    const docManager = new DocManager(userId)
    const result = await docManager.listDocuments(path)
    
    if ('error' in result) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status || 500 }
      )
    }
    
    return NextResponse.json({ files: result.data })
  } catch (error) {
    return NextResponse.json(
      { error: '获取文件列表失败' },
      { status: 500 }
    )
  }
} 