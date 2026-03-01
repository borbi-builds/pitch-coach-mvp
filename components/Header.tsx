import Link from 'next/link'
import { Mic } from 'lucide-react'

interface HeaderProps {
  minimal?: boolean
}

export default function Header({ minimal }: HeaderProps) {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="px-4 py-4 max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Mic className="w-6 h-6 text-blue-600" />
          <span className="text-xl font-bold text-slate-900">Pitch Coach</span>
        </Link>
        {!minimal && (
          <nav className="flex items-center gap-6">
            <a href="#" className="text-sm text-slate-600 hover:text-slate-900">
              Help
            </a>
            <button className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900">
              Logout
            </button>
          </nav>
        )}
      </div>
    </header>
  )
}
