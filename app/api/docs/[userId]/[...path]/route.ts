import { NextRequest, NextResponse } from 'next/server'
import { authenticateUser, unauthorized } from '@/lib/authMiddleware'
import { readUserFile, saveUserFile } from '@/lib/userFiles'

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string; path: string[] } }
) {
  const authUserId = await authenticateUser()
  if (!authUserId || authUserId !== params.userId) {
    return unauthorized()
  }

  const filePath = params.path.join('/')
  const content = await readUserFile(params.userId, filePath)

  if (content === null) {
    return NextResponse.json(
      { error: '文档不存在' },
      { status: 404 }
    )
  }

  return NextResponse.json({ content })
}

export async function POST(
  request: NextRequest,
  { params }: { params: { userId: string; path: string[] } }
) {
  const authUserId = await authenticateUser()
  if (!authUserId || authUserId !== params.userId) {
    return unauthorized()
  }

  try {
    const { content } = await request.json()
    const filePath = params.path.join('/')
    
    await saveUserFile(params.userId, filePath, content)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: '保存失败' },
      { status: 500 }
    )
  }
}