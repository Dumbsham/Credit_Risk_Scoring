import { useState } from "react"
import Header from "./components/Header"
import ApplicantForm from "./components/ApplicantForm"
import RiskDashboard from "./components/RiskDashboard"

export default function App() {
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handlePredict = async (formData) => {
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const res = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      setResult(data)
    } catch (err) {
      setError("CONNECTION FAILED — IS BACKEND ONLINE?")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#050508] text-white">
      {/* Grid background */}
      <div className="fixed inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(0,255,136,0.5) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(0,255,136,0.5) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-8 space-y-6">
        <Header />

        {error && (
          <div className="mono text-red-400 text-sm border border-red-500/30 rounded px-4 py-3 bg-red-500/5 animate-pulse">
            ⚠ {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ApplicantForm onPredict={handlePredict} loading={loading} />
          {result
            ? <RiskDashboard result={result} />
            : <EmptyState />
          }
        </div>
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="glow-border rounded-2xl bg-[#0d0d14] flex flex-col items-center justify-center p-12 space-y-4">
      <div className="w-24 h-24 rounded-full border-2 border-dashed border-green-500/20 flex items-center justify-center">
        <div className="w-3 h-3 rounded-full bg-green-400/40 pulse-dot" />
      </div>
      <p className="mono text-green-500/40 text-sm tracking-widest">AWAITING INPUT</p>
      <p className="text-white/20 text-xs text-center">Submit applicant profile to<br/>generate risk assessment</p>
    </div>
  )
}