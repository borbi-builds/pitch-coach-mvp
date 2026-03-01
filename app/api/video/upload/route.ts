import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

function generateId() {
  return Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const video = formData.get('video') as File
    const sessionId = formData.get('sessionId') as string
    const duration = formData.get('duration') as string

    if (!video || !sessionId) {
      return NextResponse.json(
        { message: 'Missing video or sessionId' },
        { status: 400 }
      )
    }

    // Generate video ID
    const videoId = generateId()

    // Store video locally (MVP only)
    // In production: Use S3/Supabase cloud storage
    const uploadDir = join(process.cwd(), 'public', 'uploads', sessionId, 'videos')
    await mkdir(uploadDir, { recursive: true })

    const buffer = await video.arrayBuffer()
    const filePath = join(uploadDir, `${videoId}.webm`)
    await writeFile(filePath, Buffer.from(buffer))

    // Trigger async analysis job (stub for now)
    // In production: Queue to Bull/Celery with Python workers
    triggerAnalysisJob(videoId, sessionId, parseInt(duration))

    return NextResponse.json({
      videoId,
      sessionId,
      duration: parseInt(duration),
      fileSize: buffer.byteLength,
    })
  } catch (error) {
    console.error('Video upload error:', error)
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Upload failed' },
      { status: 500 }
    )
  }
}

// Stub: In production, queue this to a job processor
function triggerAnalysisJob(videoId: string, sessionId: string, duration: number) {
  console.log(`Analysis job queued: ${videoId}`)
  // TODO: Send to Bull queue or HTTP webhook to Python worker service
  // Worker will run:
  // 1. MediaPipe analysis (pose, hand, face detection)
  // 2. Deepgram transcription
  // 3. pytesseract slide OCR
  // 4. Claude argument analysis
}
