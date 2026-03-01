'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import FeedbackSection from '@/components/FeedbackSection'
import { RotateCcw, Share2, Eye } from 'lucide-react'

interface FeedbackData {
  overallScore: number
  deliveryScore: number
  argumentScore: number
  slidesScore: number
  delivery: {
    wellDone: string[]
    needsWork: string[]
    actionItems: string[]
  }
  argument: {
    wellDone: string[]
    needsWork: string[]
    actionItems: string[]
  }
  slides: {
    wellDone: string[]
    needsWork: string[]
    actionItems: string[]
  }
}

export default function FeedbackPage() {
  const router = useRouter()
  const [expandedSection, setExpandedSection] = useState<string | null>(null)

  // Mock feedback data - in production this comes from analysis API
  const feedbackData: FeedbackData = {
    overallScore: 71,
    deliveryScore: 68,
    argumentScore: 74,
    slidesScore: 71,
    delivery: {
      wellDone: [
        'Strong eye contact (92% of video)',
        'Confident pace (2.1 words/second)',
        'Varied intonation (4 tonal ranges detected)',
      ],
      needsWork: [
        'Filler words: "um" (7x) + "like" (3x)',
        'Body movement: Minimal (3 gestures in 4:32, ideal is 8-12)',
        'Facial expression: Neutral 40% of the time',
      ],
      actionItems: [
        'Replace "um" with pauses',
        'Practice with exaggerated hand gestures',
        'Smile when discussing your passion',
      ],
    },
    argument: {
      wellDone: [
        'Thesis stated clearly at 0:52',
        'Problem → Solution → Evidence structure is logical',
        'Uses 2 credible data points',
      ],
      needsWork: [
        'Thesis not reinforced until minute 3:45',
        '"Why now" argument is weak',
        'Emotional connection is weak',
      ],
      actionItems: [
        'Restate thesis at 2:00-2:30',
        'Add regulatory or market trend data to "why now"',
        'Add 30-second personal origin story',
      ],
    },
    slides: {
      wellDone: [
        'Consistent color scheme (navy + white)',
        'All text readable from 20 feet',
        'Good visual balance (hero images on 4 slides)',
      ],
      needsWork: [
        'Slide 3: 8 bullet points (recommend max 4)',
        'Slide 8: Chart labels too small (8pt, need 14pt+)',
        '3 text-only slides without visuals',
      ],
      actionItems: [
        'Edit Slide 3: Keep only top 3-4 bullets',
        'Edit Slide 8: Increase chart labels 8pt → 14pt+',
        'Add visuals to 3 text-heavy slides',
      ],
    },
  }

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
              Recorded: Feb 28, 2026 • 4:32 (12 slides)
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
              Good foundation. You have strong delivery and logical argument structure. Focus on
              reducing filler words and deepening your personal connection to the idea.
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
