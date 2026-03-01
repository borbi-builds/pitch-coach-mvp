'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import { CircleDot, Clapperboard, FileText, Image } from 'lucide-react'

interface Analysis {
  name: string
  status: 'pending' | 'running' | 'complete'
  progress: number
  description: string
  icon: React.ReactNode
}

export default function AnalysisPage() {
  const router = useRouter()
  const [analyses, setAnalyses] = useState<Analysis[]>([
    {
      name: 'Delivery Analysis (Video)',
      status: 'pending',
      progress: 0,
      description: 'Eye contact, gestures, pace, filler words',
      icon: <Clapperboard className="w-5 h-5" />,
    },
    {
      name: 'Argument Analysis',
      status: 'pending',
      progress: 0,
      description: 'Thesis clarity, logic flow, persuasiveness',
      icon: <FileText className="w-5 h-5" />,
    },
    {
      name: 'Slide Analysis (Design)',
      status: 'pending',
      progress: 0,
      description: 'Design, readability, alignment',
      icon: <Image className="w-5 h-5" />,
    },
  ])

  const [duration, setDuration] = useState<string>('')
  const [overallProgress, setOverallProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const dur = sessionStorage.getItem('duration')
    if (dur) setDuration(dur)

    const startAnalysis = async () => {
      try {
        // Get data from session storage
        const videoId = sessionStorage.getItem('videoId')
        const recordingId = sessionStorage.getItem('recordingId') || videoId || 'demo-recording'

        // For MVP, we use mock video URLs
        const videoUrl = `https://example.com/videos/${videoId}.webm`
        const audioUrl = `https://example.com/audio/${videoId}.wav`
        const slideUrls = [
          'https://example.com/slides/1.png',
          'https://example.com/slides/2.png',
          'https://example.com/slides/3.png',
        ]

        // Update UI to show running
        setAnalyses((prev) => {
          const updated = [...prev]
          updated[0].status = 'running'
          updated[0].progress = 10
          return updated
        })

        // Call the analysis API with all 4 engines in parallel
        console.log('[ANALYSIS PAGE] Triggering analysis API')
        const response = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            recordingId,
            videoUrl,
            audioUrl,
            slideUrls,
          }),
        })

        if (!response.ok) {
          throw new Error(`Analysis failed: ${response.statusText}`)
        }

        const data = await response.json()
        console.log('[ANALYSIS PAGE] Received feedback:', data.feedback)

        // Save feedback to session storage for feedback page
        sessionStorage.setItem('feedbackData', JSON.stringify(data.feedback))
        sessionStorage.setItem('recordingDate', new Date().toLocaleDateString())

        // Animate progress bars
        const progressInterval = setInterval(() => {
          setAnalyses((prev) => {
            const updated = [...prev]
            let allComplete = true

            updated.forEach((a, i) => {
              if (a.progress < 100) {
                a.progress = Math.min(a.progress + Math.random() * 25, 100)
                if (a.progress >= 100) {
                  a.status = 'complete'
                  a.progress = 100
                } else {
                  a.status = 'running'
                  allComplete = false
                }
              }
            })

            // Calculate overall
            const total = updated.reduce((sum, a) => sum + a.progress, 0) / 3
            setOverallProgress(Math.round(total))

            // Redirect when done
            if (allComplete) {
              clearInterval(progressInterval)
              setTimeout(() => {
                router.push('/feedback')
              }, 1000)
            }

            return updated
          })
        }, 300)
      } catch (err) {
        console.error('[ANALYSIS PAGE] Error:', err)
        setError(err instanceof Error ? err.message : 'Analysis failed')
        setAnalyses((prev) =>
          prev.map((a) => ({
            ...a,
            status: 'pending' as const,
            progress: 0,
          }))
        )
      }
    }

    // Start analysis on mount
    startAnalysis()
  }, [router])

  if (error) {
    return (
      <main className="flex-1 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="max-w-2xl w-full">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <p className="text-red-900 font-medium mb-2">Analysis Error</p>
              <p className="text-red-800 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="flex-1 flex flex-col">
      <Header />
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-2xl w-full">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-slate-900">
              🎬 Analyzing Your Pitch
            </h2>
            <p className="text-slate-600 mb-4">
              {duration && `Recording: ${duration}s`}
            </p>
            <p className="text-sm text-slate-500">
              Processing 4 analysis engines in parallel...
            </p>
          </div>

          <div className="space-y-6 mb-12">
            {analyses.map((analysis) => (
              <div
                key={analysis.name}
                className="border border-slate-200 rounded-lg p-6 bg-white"
              >
                <div className="flex items-start gap-3 mb-4">
                  <div
                    className={`p-2 rounded-lg ${
                      analysis.status === 'complete'
                        ? 'bg-green-100 text-green-600'
                        : analysis.status === 'running'
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {analysis.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                      {analysis.name}
                      {analysis.status === 'complete' && (
                        <span className="text-sm text-green-600">✓</span>
                      )}
                      {analysis.status === 'running' && (
                        <div className="inline-block animate-spin">
                          <CircleDot className="w-4 h-4 text-blue-600" />
                        </div>
                      )}
                    </h3>
                    <p className="text-sm text-slate-600">{analysis.description}</p>
                  </div>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      analysis.status === 'complete'
                        ? 'bg-green-600'
                        : analysis.status === 'running'
                        ? 'bg-blue-600'
                        : 'bg-slate-300'
                    }`}
                    style={{ width: `${analysis.progress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  {Math.round(analysis.progress)}%
                </p>
              </div>
            ))}
          </div>

          <div className="bg-slate-100 rounded-lg p-6 border border-slate-200">
            <div className="text-center">
              <p className="text-sm font-medium text-slate-600 mb-3">
                Overall: {overallProgress}% complete
              </p>
              <div className="w-full bg-slate-300 rounded-full h-3 overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all duration-300"
                  style={{ width: `${overallProgress}%` }}
                ></div>
              </div>
              <p className="text-xs text-slate-500 mt-3">
                {overallProgress === 100 ? 'Finalizing...' : `Processing...`}
              </p>
            </div>
          </div>

          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              💡 <strong>Analysis includes:</strong> Eye contact & gestures (video), transcription & pacing (audio), slide design metrics, argument structure & persuasion scoring.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
