import {Sparkles} from 'lucide-react'

export const Header = () => {
  return <>
    <header className="flex items-center justify-between border-b border-zinc-800/80 pb-6">
      <div className="flex items-center space-x-3">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-white">Gultakin Essay Checker</h1>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-zinc-900 border border-zinc-800 text-zinc-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2 animate-pulse" />
          Engine Ready
        </span>
      </div>
    </header>
  </>
}