'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronRight, Pause, Square } from 'lucide-react'

interface Slide {
  id: number
  thumbnailUrl: string
}

interface RecordingBoothProps {
  sessionId: string
}

export default function RecordingBooth({ sessionId }: RecordingBoothProps) {
  const router = useRouter()
  const videoRef = useRef<HTMLVideoElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const chunksRef = useRef<Blob[]>([])

  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [slides, setSlides] = useState<Slide[]>([])
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [wordsCount, setWordsCount] = useState(0)

  // Load slides
  useEffect(() => {
    const loadSlides = async () => {
      try {
        const response = await fetch(`/api/slides?sessionId=${sessionId}`)
        if (!response.ok) throw new Error('Failed to load slides')
        const data = await response.json()
        setSlides(data.slides)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load slides')
      } finally {
        setIsLoading(false)
      }
    }
    loadSlides()
  }, [sessionId])

  // Request camera/mic permissions
  useEffect(() => {
    if (isLoading) return

    const setupCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: true,
        })

        if (videoRef.current) {
          videoRef.current.srcObject = stream

          // Setup MediaRecorder
          const mediaRecorder = new MediaRecorder(stream, {
            mimeType: 'video/webm',
          })

          mediaRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) {
              chunksRef.current.push(e.data)
            }
          }

          mediaRecorder.onstop = async () => {
            const blob = new Blob(chunksRef.current, { type: 'video/webm' })
            await uploadVideo(blob)
          }

          mediaRecorderRef.current = mediaRecorder
          setIsRecording(true)
          mediaRecorder.start()
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Failed to access camera/microphone'
        )
      }
    }

    setupCamera()
  }, [isLoading, sessionId])

  // Timer for elapsed time
  useEffect(() => {
    if (!isRecording || isPaused) return

    const interval = setInterval(() => {
      setElapsedSeconds((s) => s + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [isRecording, isPaused])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const calculatePace = (): number => {
    if (elapsedSeconds === 0) return 0
    const minutesElapsed = elapsedSeconds / 60
    return parseFloat((wordsCount / minutesElapsed).toFixed(2))
  }

  const getPaceStatus = () => {
    const pace = calculatePace()
    if (pace >= 2.0 && pace <= 2.5) return 'Good'
    if (pace > 2.5) return 'Too fast'
    if (pace > 0 && pace < 2.0) return 'Too slow'
    return 'Speaking...'
  }

  const handleNextSlide = () => {
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex((i) => i + 1)
    }
  }

  const handlePause = () => {
    if (mediaRecorderRef.current) {
      if (isPaused) {
        mediaRecorderRef.current.resume()
        setIsPaused(false)
      } else {
        mediaRecorderRef.current.pause()
        setIsPaused(true)
      }
    }
  }

  const handleFinish = async () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
      setIsRecording(false)

      // Stop video stream
      const stream = videoRef.current?.srcObject as MediaStream
      stream?.getTracks().forEach((track) => track.stop())
    }
  }

  const uploadVideo = async (blob: Blob) => {
    try {
      const formData = new FormData()
      formData.append('video', blob)
      formData.append('sessionId', sessionId)
      formData.append('duration', elapsedSeconds.toString())

      const response = await fetch('/api/video/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) throw new Error('Failed to upload video')

      const data = await response.json()
      sessionStorage.setItem('videoId', data.videoId)
      sessionStorage.setItem('duration', elapsedSeconds.toString())

      router.push('/analysis')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    }
  }

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Setting up recording booth...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="max-w-md text-center">
          <p className="text-red-900 font-medium mb-4">Error</p>
          <p className="text-red-800 mb-4">{error}</p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col bg-slate-900">
      <div className="flex-1 flex gap-4 p-4">
        {/* Left: Camera Feed (70%) */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 bg-black rounded-lg overflow-hidden relative flex items-center justify-center">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            <canvas
              ref={canvasRef}
              className="hidden"
              width={1280}
              height={720}
            />
          </div>

          {/* Timer and Metrics */}
          <div className="mt-4 bg-slate-800 rounded-lg p-4 text-white">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-400">Elapsed</p>
                <p className="text-2xl font-mono font-bold">{formatTime(elapsedSeconds)}</p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Pace</p>
                <p className="text-2xl font-mono font-bold">
                  {calculatePace()} wps
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Status: {getPaceStatus()} (ideal: 2.0-2.5)
                </p>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="mt-4 flex gap-2 justify-center">
            <button
              onClick={handleNextSlide}
              disabled={currentSlideIndex >= slides.length - 1}
              className="px-6 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white rounded-lg flex items-center gap-2 font-medium transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
              Next Slide
            </button>
            <button
              onClick={handlePause}
              className="px-6 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg flex items-center gap-2 font-medium transition-colors"
            >
              <Pause className="w-4 h-4" />
              {isPaused ? 'Resume' : 'Pause'}
            </button>
            <button
              onClick={handleFinish}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center gap-2 font-medium transition-colors"
            >
              <Square className="w-4 h-4" />
              Finish Recording
            </button>
          </div>
        </div>

        {/* Right: Slides (30%) */}
        <div className="w-80 flex flex-col bg-slate-800 rounded-lg p-4 overflow-hidden">
          <h3 className="text-white font-semibold mb-4">Slides</h3>
          <div className="flex-1 overflow-y-auto space-y-2">
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className={`border-2 rounded-lg overflow-hidden cursor-pointer transition-all ${
                  index === currentSlideIndex
                    ? 'border-blue-500 bg-blue-900'
                    : 'border-slate-600 hover:border-slate-500'
                }`}
                onClick={() => setCurrentSlideIndex(index)}
              >
                <img
                  src={slide.thumbnailUrl}
                  alt={`Slide ${slide.id}`}
                  className="w-full aspect-video object-cover"
                />
                <div className="p-2 text-center text-xs text-slate-300 bg-slate-700">
                  {index === currentSlideIndex ? (
                    <span className="font-bold text-blue-300">Slide {slide.id} (current)</span>
                  ) : (
                    <span>Slide {slide.id}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
