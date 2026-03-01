'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import FileUploadZone from '@/components/FileUploadZone'
import Header from '@/components/Header'

export default function Dashboard() {
  const router = useRouter()
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const handleFileUpload = async (file: File) => {
    setIsUploading(true)
    setUploadError(null)

    try {
      // Validate file
      if (!file.name.endsWith('.pptx')) {
        throw new Error('Please upload a valid PowerPoint (.pptx) file')
      }

      if (file.size > 100 * 1024 * 1024) {
        throw new Error('File size must be less than 100MB')
      }

      // Create FormData for upload
      const formData = new FormData()
      formData.append('file', file)

      // Upload to backend
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Upload failed')
      }

      const data = await response.json()

      // Store session and proceed to slide preview
      sessionStorage.setItem('pitchSessionId', data.sessionId)
      sessionStorage.setItem('fileName', file.name)

      router.push('/setup/preview')
    } catch (error) {
      setUploadError(
        error instanceof Error ? error.message : 'Upload failed'
      )
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <main className="flex-1 flex flex-col">
      <Header />
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-2xl w-full py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 text-slate-900">
              Ready to practice your pitch?
            </h1>
            <p className="text-lg text-slate-600 mb-8">
              Upload your PowerPoint presentation and we'll give you detailed AI-powered feedback on your delivery, argument, and slides.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 inline-block">
              <p className="text-sm text-blue-900">
                💡 <strong>Tip:</strong> Practice pitches are best 10-20 minutes. We'll analyze your delivery, argument, and slides, then give you specific coaching feedback.
              </p>
            </div>
          </div>

          <FileUploadZone
            onFileSelect={handleFileUpload}
            isLoading={isUploading}
            error={uploadError || undefined}
          />
        </div>
      </div>
    </main>
  )
}
