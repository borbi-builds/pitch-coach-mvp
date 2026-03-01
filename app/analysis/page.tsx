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
      name: 'Delivery Analysis',
      status: 'running',
      progress: 35,
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
      name: 'Slide Analysis',
      status: 'pending',
      progress: 0,
      description: 'Design, readability, alignment',
      icon: <Image className="w-5 h-5" />,
    },
  ])

  const [duration, setDuration] = useState<string>('')
  const [overallProgress, setOverallProgress] = useState(35)

  useEffect(() => {
    const dur = sessionStorage.getItem('duration')
    if (dur) setDuration(dur)

    // Simulate analysis progress
    const interval = setInterval(() => {
      setAnalyses((prev) => {
        const updated = [...prev]
        let totalProgress = 0

        // Update first analysis
        if (updated[0].status === 'running') {
          updated[0].progress = Math.min(updated[0].progress + Math.random() * 10, 100)
          if (updated[0].progress >= 100) {
            updated[0].status = 'complete'
            updated[1].status = 'running'
          }
        }

        // Update second analysis
        if (updated[1].status === 'running') {
          updated[1].progress = Math.min(updated[1].progress + Math.random() * 8, 100)
          if (updated[1].progress >= 100) {
            updated[1].status = 'complete'
            updated[2].status = 'running'
          }
        }

        // Update third analysis
        if (updated[2].status === 'running') {
          updated[2].progress = Math.min(updated[2].progress + Math.random() * 8, 100)
          if (updated[2].progress >= 100) {
            updated[2].status = 'complete'
          }
        }

        // Calculate overall progress
        totalProgress = updated.reduce((sum, a) => sum + a.progress, 0) / 3

        setOverallProgress(Math.round(totalProgress))

        // If all complete, redirect to feedback
        if (
          updated[0].status === 'complete' &&
          updated[1].status === 'complete' &&
          updated[2].status === 'complete'
        ) {
          setTimeout(() => {
            router.push('/feedback')
          }, 1500)
        }

        return updated
      })
    }, 400)

    return () => clearInterval(interval)
  }, [router])

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
              {duration && `Recording saved (${duration}s video)`}
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
                        : 'bg-blue-600'
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
                ~{Math.max(0, 120 - Math.round(overallProgress * 1.2))} seconds remaining
              </p>
            </div>
          </div>

          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              💡 <strong>Tip:</strong> We're using AI to analyze your video, audio, and slides.
              Results will be detailed and actionable.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
