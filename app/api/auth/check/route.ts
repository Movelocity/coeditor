import { NextResponse } from 'next/server'
import { checkAuth } from '@/lib/backend/auth'

export async function GET() {
  try {
    const result = await checkAuth()
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 401 }
    )
  }
} 