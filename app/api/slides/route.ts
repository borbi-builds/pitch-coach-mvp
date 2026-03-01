import { NextRequest, NextResponse } from 'next/server'

// Stub implementation - returns mock slides
// TODO: Parse actual PPTX and generate thumbnails using libreoffice or equivalent
export async function GET(request: NextRequest) {
  try {
    const sessionId = request.nextUrl.searchParams.get('sessionId')

    if (!sessionId) {
      return NextResponse.json(
        { message: 'Missing sessionId' },
        { status: 400 }
      )
    }

    // For MVP: Return mock slides with placeholder thumbnails
    // In production, use:
    // - python-pptx to read slide count
    // - libreoffice --headless --convert-to pdf to convert to PDF
    // - pdf2image to generate slide thumbnails

    const mockSlides = Array.from({ length: 12 }, (_, i) => ({
      id: i + 1,
      thumbnailUrl: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='180'%3E%3Crect fill='%23e0e7ff' width='320' height='180'/%3E%3Ctext x='50%25' y='50%25' font-size='24' font-family='Arial' fill='%234f46e5' text-anchor='middle' dominant-baseline='middle'%3ESlide ${i + 1}%3C/text%3E%3C/svg%3E`,
    }))

    return NextResponse.json({
      sessionId,
      slides: mockSlides,
    })
  } catch (error) {
    console.error('Slides error:', error)
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Failed to load slides' },
      { status: 500 }
    )
  }
}
