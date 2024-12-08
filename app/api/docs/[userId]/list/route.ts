import { NextRequest, NextResponse } from 'next/server'
import { authenticateUser, unauthorized } from '@/lib/backend/auth'
import { listUserFiles } from '@/lib/backend/userFiles'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params
  const searchParams = request.nextUrl.searchParams
  const mode = searchParams.get('mode') || 'private'
  const path = searchParams.get('path') || ''

  if (mode !== 'public') {
    const authUserId = await authenticateUser()
    if (!authUserId || authUserId !== userId) {
      return unauthorized()
    }
  }

  try {
    const files = await listUserFiles(userId, path)
    return NextResponse.json({ files })
  } catch (error) {
    return NextResponse.json(
      { error: '获取文件列表失败' },
      { status: 500 }
    )
  }
} 