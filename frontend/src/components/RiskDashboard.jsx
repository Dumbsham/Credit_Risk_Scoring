import { useEffect, useState } from "react"

const RISK_CONFIG = {
  High:   { color: "#ff3b3b", glow: "rgba(255,59,59,0.3)",   label: "HIGH RISK",   verdict: "REJECT" },
  Medium: { color: "#ffb800", glow: "rgba(255,184,0,0.3)",   label: "MEDIUM RISK", verdict: "REVIEW" },
  Low:    { color: "#00ff88", glow: "rgba(0,255,136,0.3)",   label: "LOW RISK",    verdict: "APPROVE" },
}

export default function RiskDashboard({ result }) {
  const [animated, setAnimated] = useState(false)
  const config = RISK_CONFIG[result.risk_level]

  useEffect(() => {
    setAnimated(false)
    const t = setTimeout(() => setAnimated(true), 100)
    return () => clearTimeout(t)
  }, [result])

  return (
    <div className="space-y-4">
      {/* Main score card */}
      <div
        className="rounded-2xl bg-[#0d0d14] p-6 slide-up"
        style={{
          border: `1px solid ${config.color}30`,
          boxShadow: `0 0 40px ${config.glow}, inset 0 0 40px ${config.glow}20`
        }}
      >
        {/* Verdict banner */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="mono text-white/30 text-[10px] tracking-widest mb-1">ASSESSMENT RESULT</p>
            <p className="text-3xl font-bold tracking-tight" style={{ color: config.color }}>
              {config.verdict}
            </p>
          </div>
          <div className="text-right">
            <p className="mono text-white/30 text-[10px] tracking-widest mb-1">RISK LEVEL</p>
            <span
              className="mono text-xs px-3 py-1 rounded-full border font-bold tracking-widest"
              style={{ color: config.color, borderColor: `${config.color}40`, background: `${config.color}10` }}
            >
              {config.label}
            </span>
          </div>
        </div>

        {/* Big probability display */}
        <div className="text-center mb-6">
          <p className="mono text-white/20 text-xs tracking-widest mb-2">DEFAULT PROBABILITY</p>
          <p
            className="text-7xl font-bold mono count-up"
            style={{ color: config.color, textShadow: `0 0 30px ${config.color}` }}
          >
            {result.default_probability}
            <span className="text-3xl">%</span>
          </p>
        </div>

        {/* Probability bar */}
        <div className="space-y-2">
          <div className="flex justify-between mono text-xs text-white/30">
            <span>SAFE {result.safe_probability}%</span>
            <span>DEFAULT {result.default_probability}%</span>
          </div>
          <div className="w-full bg-white/5 rounded-full h-3 overflow-hidden">
            <div
              className="h-3 rounded-full transition-all duration-1000 ease-out"
              style={{
                width: animated ? `${result.default_probability}%` : '0%',
                background: `linear-gradient(90deg, ${config.color}80, ${config.color})`,
                boxShadow: `0 0 10px ${config.color}`
              }}
            />
          </div>
        </div>
      </div>

      {/* SHAP Explanation */}
      <div className="glow-border rounded-2xl bg-[#0d0d14] p-6 slide-up-delay-1">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-5 bg-amber-400 rounded" />
          <span className="mono text-amber-400/80 text-xs tracking-widest">RISK FACTORS</span>
        </div>

        <div className="space-y-3">
          {result.explanation.map((item, i) => {
            const isRisk = item.impact > 0
            const barColor = isRisk ? "#ff3b3b" : "#00ff88"
            const maxImpact = Math.max(...result.explanation.map(e => Math.abs(e.impact)))
            const pct = (Math.abs(item.impact) / maxImpact) * 100

            return (
              <div key={i} className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="mono text-white/50 text-[11px] tracking-wide">
                    {item.feature.replace(/_/g, ' ').toUpperCase()}
                  </span>
                  <span
                    className="mono text-xs font-bold"
                    style={{ color: barColor }}
                  >
                    {isRisk ? "▲" : "▼"} {Math.abs(item.impact).toFixed(4)}
                  </span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-1.5 rounded-full"
                    style={{
                      width: animated ? `${pct}%` : '0%',
                      background: barColor,
                      boxShadow: `0 0 6px ${barColor}`,
                      transition: `width ${0.5 + i * 0.1}s ease-out`
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>

        <p className="mono text-white/20 text-[10px] mt-4 tracking-wide">
          ▲ INCREASES RISK  ·  ▼ DECREASES RISK  ·  POWERED BY SHAP
        </p>
      </div>
    </div>
  )
}