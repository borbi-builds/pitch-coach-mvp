'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import RecordingBooth from '@/components/RecordingBooth'

export default function RecordPage() {
  const router = useRouter()
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const id = sessionStorage.getItem('pitchSessionId')
    if (!id) {
      router.push('/')
      return
    }
    setSessionId(id)
    setIsReady(true)
  }, [router])

  if (!isReady || !sessionId) {
    return (
      <main className="flex-1 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Preparing recording booth...</p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="flex-1 flex flex-col">
      <Header minimal />
      <RecordingBooth sessionId={sessionId} />
    </main>
  )
}
