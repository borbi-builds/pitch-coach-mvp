import { ChevronDown } from 'lucide-react'
import { useState } from 'react'

interface FeedbackSectionProps {
  title: string
  score: number
  isExpanded: boolean
  onToggle: () => void
  content: {
    wellDone: string[]
    needsWork: string[]
    actionItems: string[]
  }
}

export default function FeedbackSection({
  title,
  score,
  isExpanded,
  onToggle,
  content,
}: FeedbackSectionProps) {
  return (
    <div className="border-2 border-slate-200 rounded-lg bg-white overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-3 text-left flex-1">
          <div>
            <h3 className="font-semibold text-slate-900">{title}</h3>
            <p className="text-sm text-slate-600">{score}/100</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-16 bg-slate-200 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full"
              style={{ width: `${score}%` }}
            ></div>
          </div>
          <ChevronDown
            className={`w-5 h-5 text-slate-400 transition-transform ${
              isExpanded ? 'rotate-180' : ''
            }`}
          />
        </div>
      </button>

      {isExpanded && (
        <div className="border-t border-slate-200 px-4 py-6 space-y-6">
          {/* What Went Well */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-3">What Went Well</h4>
            <ul className="space-y-2">
              {content.wellDone.map((item, i) => (
                <li key={i} className="flex gap-3 text-slate-700">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* What Needs Work */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-3">What Needs Work</h4>
            <ul className="space-y-2">
              {content.needsWork.map((item, i) => (
                <li key={i} className="flex gap-3 text-slate-700">
                  <span className="text-yellow-600 font-bold">⚠</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action Items */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Action Items</h4>
            <ol className="space-y-2">
              {content.actionItems.map((item, i) => (
                <li key={i} className="flex gap-3 text-slate-700">
                  <span className="font-bold text-blue-600">{i + 1}️⃣</span>
                  <span>{item}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </div>
  )
}
