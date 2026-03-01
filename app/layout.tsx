import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Pitch Coach',
  description: 'AI-powered pitch coaching with real-time feedback',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50">
        <div className="min-h-screen flex flex-col">
          {children}
        </div>
      </body>
    </html>
  )
}
