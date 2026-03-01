'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, CheckCircle } from 'lucide-react'
import Header from '@/components/Header'

interface Slide {
  id: number
  thumbnailUrl: string
}

export default function SlidePreview() {
  const router = useRouter()
  const [slides, setSlides] = useState<Slide[]>([])
  const [fileName, setFileName] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadSlides = async () => {
      try {
        const sessionId = sessionStorage.getItem('pitchSessionId')
        const name = sessionStorage.getItem('fileName')

        if (!sessionId) {
          router.push('/')
          return
        }

        setFileName(name || 'presentation.pptx')

        // Fetch slide thumbnails
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
  }, [router])

  if (isLoading) {
    return (
      <main className="flex-1 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading your slides...</p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="flex-1 flex flex-col">
      <Header />
      <div className="flex-1 flex flex-col px-4 py-8">
        <div className="max-w-6xl mx-auto w-full">
          <Link
            href="/"
            className="flex items-center text-blue-600 hover:text-blue-700 mb-8"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Upload different file
          </Link>

          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2 text-slate-900">
              "{fileName}" loaded ({slides.length} slides)
            </h2>
            <p className="text-slate-600">
              Review your slides below. When ready, click "Start Recording" to begin your pitch.
            </p>
          </div>

          {error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
              <p className="text-red-900">{error}</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-12">
                {slides.map((slide) => (
                  <div
                    key={slide.id}
                    className="border border-slate-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow bg-white"
                  >
                    <img
                      src={slide.thumbnailUrl}
                      alt={`Slide ${slide.id}`}
                      className="w-full aspect-video object-cover"
                    />
                    <div className="p-2 text-center text-sm font-medium text-slate-600">
                      Slide {slide.id}
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-12 flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-green-900 font-medium">All slides loaded. Camera ready.</p>
                  <p className="text-sm text-green-800 mt-1">
                    Make sure you have good lighting and a quiet room for the best analysis.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => router.push('/record')}
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Ready to record →
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  )
}
