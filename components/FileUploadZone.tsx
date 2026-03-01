'use client'

import { useRef, useState } from 'react'
import { Upload, AlertCircle } from 'lucide-react'

interface FileUploadZoneProps {
  onFileSelect: (file: File) => void
  isLoading: boolean
  error?: string | null
}

export default function FileUploadZone({
  onFileSelect,
  isLoading,
  error,
}: FileUploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      onFileSelect(files[0])
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      onFileSelect(files[0])
    }
  }

  return (
    <div>
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
          dragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-slate-300 bg-white hover:border-slate-400'
        } ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pptx"
          onChange={handleChange}
          disabled={isLoading}
          className="hidden"
        />

        <div className="flex flex-col items-center gap-3">
          <Upload className="w-12 h-12 text-slate-400" />
          <div>
            <p className="font-semibold text-slate-900">
              📁 Upload your presentation (PPTX)
            </p>
            <p className="text-sm text-slate-600 mt-1">
              Drag & drop here or click to browse
            </p>
          </div>
          {isLoading && (
            <div className="mt-4 flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="text-sm text-slate-600">Uploading...</span>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-900">{error}</p>
        </div>
      )}
    </div>
  )
}
