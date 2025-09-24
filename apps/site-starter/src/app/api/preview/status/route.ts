import { NextResponse } from 'next/server'
import { isPreview } from '@/lib/preview'

export async function GET() {
  try {
    const previewMode = await isPreview()
    
    return NextResponse.json({
      isPreview: previewMode
    })
  } catch (error) {
    console.error('Preview status error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
