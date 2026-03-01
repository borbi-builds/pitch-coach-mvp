'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import FeedbackSection from '@/components/FeedbackSection'
import { RotateCcw, Share2, Eye } from 'lucide-react'
import type { FeedbackData } from '@/lib/store'

export default function FeedbackPage() {
  const router = useRouter()
  const [expandedSection, setExpandedSection] = useState<string | null>(null)
  const [feedbackData, setFeedbackData] = useState<FeedbackData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [recordingDate, setRecordingDate] = useState('Unknown')
  const [recordingDuration, setRecordingDuration] = useState('00:00')

  useEffect(() => {
    // Load feedback from session/local storage or API
    const loadFeedback = async () => {
      try {
        // Try to get from session storage first
        const storedFeedback = sessionStorage.getItem('feedbackData')
        if (storedFeedback) {
          setFeedbackData(JSON.parse(storedFeedback))
          
          const date = sessionStorage.getItem('recordingDate') || new Date().toLocaleDateString()
          setRecordingDate(date)
          
          const duration = sessionStorage.getItem('recordingDuration') || '00:00'
          setRecordingDuration(duration)
          
          setIsLoading(false)
          return
        }

        // Otherwise, try API
        const recordingId = sessionStorage.getItem('videoId')
        if (!recordingId) {
          router.push('/')
          return
        }

        const response = await fetch(`/api/analyze?recordingId=${recordingId}`)
        if (!response.ok) throw new Error('Failed to load feedback')

        const data = await response.json()
        setFeedbackData(data.feedback)
        setRecordingDate(new Date().toLocaleDateString())
        
        const durationSecs = parseInt(sessionStorage.getItem('duration') || '0')
        const mins = Math.floor(durationSecs / 60)
        const secs = durationSecs % 60
        setRecordingDuration(`${mins}:${secs.toString().padStart(2, '0')}`)
      } catch (error) {
        console.error('Failed to load feedback:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadFeedback()
  }, [router])

  const getScoreColor = (score: number) => {
    if (score >= 75) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 75) return 'bg-green-50'
    if (score >= 60) return 'bg-yellow-50'
    return 'bg-red-50'
  }

  const handleReRecord = () => {
    // Clear feedback data and go back to recording
    sessionStorage.removeItem('feedbackData')
    router.push('/record')
  }

  const handleShare = () => {
    // TODO: Implement sharing
    alert('Share feature coming soon!')
  }

  const handleWatch = () => {
    // TODO: Implement video playback with annotations
    alert('Video playback feature coming soon!')
  }

  if (isLoading) {
    return (
      <main className="flex-1 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading your feedback...</p>
          </div>
        </div>
      </main>
    )
  }

  if (!feedbackData) {
    return (
      <main className="flex-1 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="max-w-md text-center">
            <p className="text-red-900 font-medium mb-4">Error</p>
            <p className="text-red-800 mb-4">Could not load feedback data.</p>
            <button
              onClick={() => router.push('/')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Go Home
            </button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="flex-1 flex flex-col">
      <Header />
      <div className="flex-1 flex flex-col px-4 py-8">
        <div className="max-w-4xl mx-auto w-full">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2 text-slate-900">
              Your Pitch Feedback
            </h1>
            <p className="text-slate-600">
              Recorded: {recordingDate} • {recordingDuration}
            </p>
          </div>

          {/* Overall Score Card */}
          <div
            className={`border-2 border-slate-200 rounded-lg p-8 mb-8 ${getScoreBgColor(
              feedbackData.overallScore
            )}`}
          >
            <h2 className="text-2xl font-bold mb-4 text-slate-900">
              🎯 OVERALL PITCH STRENGTH
            </h2>
            <div className="text-5xl font-bold mb-4">
              <span className={getScoreColor(feedbackData.overallScore)}>
                {feedbackData.overallScore}/100
              </span>
            </div>
            <p className="text-lg text-slate-700 mb-6">
              {feedbackData.overallScore >= 75
                ? 'Excellent pitch! You have strong delivery, clear argument structure, and professional slides.'
                : feedbackData.overallScore >= 60
                  ? 'Good foundation. Focus on the action items to strengthen your pitch.'
                  : 'Room for improvement. Work through the action items systematically.'}
            </p>

            {/* Score Breakdown */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 border border-slate-200">
                <p className="text-sm text-slate-600 mb-1">🎬 Delivery</p>
                <p className={`text-2xl font-bold ${getScoreColor(feedbackData.deliveryScore)}`}>
                  {feedbackData.deliveryScore}/100
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-slate-200">
                <p className="text-sm text-slate-600 mb-1">💡 Argument</p>
                <p className={`text-2xl font-bold ${getScoreColor(feedbackData.argumentScore)}`}>
                  {feedbackData.argumentScore}/100
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-slate-200">
                <p className="text-sm text-slate-600 mb-1">🎨 Slides</p>
                <p className={`text-2xl font-bold ${getScoreColor(feedbackData.slidesScore)}`}>
                  {feedbackData.slidesScore}/100
                </p>
              </div>
            </div>
          </div>

          {/* Feedback Sections */}
          <div className="space-y-4 mb-12">
            <FeedbackSection
              title="🎬 DELIVERY"
              score={feedbackData.deliveryScore}
              isExpanded={expandedSection === 'delivery'}
              onToggle={() =>
                setExpandedSection(expandedSection === 'delivery' ? null : 'delivery')
              }
              content={feedbackData.delivery}
            />
            <FeedbackSection
              title="💡 ARGUMENT"
              score={feedbackData.argumentScore}
              isExpanded={expandedSection === 'argument'}
              onToggle={() =>
                setExpandedSection(expandedSection === 'argument' ? null : 'argument')
              }
              content={feedbackData.argument}
            />
            <FeedbackSection
              title="🎨 SLIDES"
              score={feedbackData.slidesScore}
              isExpanded={expandedSection === 'slides'}
              onToggle={() =>
                setExpandedSection(expandedSection === 'slides' ? null : 'slides')
              }
              content={feedbackData.slides}
            />
          </div>

          {/* Next Steps */}
          <div className="border-t-2 border-slate-200 pt-8">
            <h3 className="text-xl font-bold mb-6 text-slate-900">What's Next?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <button
                onClick={handleReRecord}
                className="flex items-center gap-3 p-4 border-2 border-blue-300 rounded-lg hover:bg-blue-50 transition-colors text-left"
              >
                <RotateCcw className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-slate-900">Re-record pitch</p>
                  <p className="text-sm text-slate-600">Try again with same PPTX</p>
                </div>
              </button>
              <button
                onClick={handleWatch}
                className="flex items-center gap-3 p-4 border-2 border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-left"
              >
                <Eye className="w-5 h-5 text-slate-600 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-slate-900">Watch my recording</p>
                  <p className="text-sm text-slate-600">Review with key timestamps</p>
                </div>
              </button>
              <button
                onClick={handleShare}
                className="flex items-center gap-3 p-4 border-2 border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-left"
              >
                <Share2 className="w-5 h-5 text-slate-600 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-slate-900">Share results</p>
                  <p className="text-sm text-slate-600">Send feedback + video to others</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
