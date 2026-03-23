export default function Header() {
  const now = new Date()
  const time = now.toTimeString().slice(0, 8)
  const date = now.toISOString().slice(0, 10)

  return (
    <div className="flex items-start justify-between border-b border-green-500/10 pb-6">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div className="flex gap-1">
            <div className="w-2 h-6 bg-green-400 rounded-sm" />
            <div className="w-2 h-6 bg-green-400/60 rounded-sm" />
            <div className="w-2 h-6 bg-green-400/30 rounded-sm" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight flicker">
            <span className="gradient-text">CREDIT</span>
            <span className="text-white/80">RISK</span>
            <span className="text-green-400">_OS</span>
          </h1>
        </div>
        <p className="mono text-white/30 text-xs tracking-widest ml-9">
          NEURAL RISK ASSESSMENT SYSTEM v3.0
        </p>
      </div>

      <div className="mono text-right text-xs space-y-1">
        <div className="text-green-400/60">{date}</div>
        <div className="text-green-400/40">{time}</div>
        <div className="flex items-center gap-2 justify-end">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 pulse-dot" />
          <span className="text-green-400/60">ONLINE</span>
        </div>
      </div>
    </div>
  )
}