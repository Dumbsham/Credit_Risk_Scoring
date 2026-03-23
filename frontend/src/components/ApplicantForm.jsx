import { useState } from "react"

const FIELDS = [
  { name: "person_age", label: "AGE", type: "number", default: 28 },
  { name: "person_income", label: "ANNUAL INCOME ($)", type: "number", default: 45000 },
  { name: "person_emp_length", label: "EMPLOYMENT (YRS)", type: "number", default: 3 },
  { name: "loan_amnt", label: "LOAN AMOUNT ($)", type: "number", default: 10000 },
  { name: "loan_int_rate", label: "INTEREST RATE (%)", type: "number", default: 12.5 },
  { name: "loan_percent_income", label: "LOAN / INCOME RATIO", type: "number", default: 0.22 },
  { name: "cb_person_cred_hist_length", label: "CREDIT HISTORY (YRS)", type: "number", default: 4 },
]

const DROPDOWNS = [
  { name: "person_home_ownership", label: "HOME OWNERSHIP", options: ["RENT", "OWN", "MORTGAGE", "OTHER"] },
  { name: "loan_intent", label: "LOAN INTENT", options: ["PERSONAL", "EDUCATION", "MEDICAL", "VENTURE", "HOMEIMPROVEMENT", "DEBTCONSOLIDATION"] },
  { name: "loan_grade", label: "LOAN GRADE", options: ["A", "B", "C", "D", "E", "F", "G"] },
  { name: "cb_person_default_on_file", label: "PRIOR DEFAULT", options: ["N", "Y"] },
]

const buildDefaults = () => {
  const d = {}
  FIELDS.forEach(f => d[f.name] = f.default)
  DROPDOWNS.forEach(f => d[f.name] = f.options[0])
  return d
}

export default function ApplicantForm({ onPredict, loading }) {
  const [values, setValues] = useState(buildDefaults())

  const handleChange = (e) => {
    const val = e.target.type === "number" ? parseFloat(e.target.value) : e.target.value
    setValues({ ...values, [e.target.name]: val })
  }

  return (
    <div className="glow-border rounded-2xl bg-[#0d0d14] p-6 space-y-5">
      {/* Title */}
      <div className="flex items-center gap-2">
        <div className="w-1 h-5 bg-green-400 rounded" />
        <span className="mono text-green-400/80 text-xs tracking-widest">APPLICANT PROFILE</span>
      </div>

      {/* Numeric fields */}
      <div className="grid grid-cols-2 gap-3">
        {FIELDS.map((f) => (
          <div key={f.name} className="space-y-1">
            <label className="mono text-white/30 text-[10px] tracking-widest">{f.label}</label>
            <input
              type="number"
              name={f.name}
              value={values[f.name]}
              onChange={handleChange}
              step="any"
              className="w-full bg-black/40 border border-green-500/10 rounded-lg px-3 py-2 mono text-sm text-green-300 focus:outline-none focus:border-green-400/50 focus:bg-black/60 transition-all"
            />
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="border-t border-green-500/10" />

      {/* Dropdowns */}
      <div className="grid grid-cols-2 gap-3">
        {DROPDOWNS.map((f) => (
          <div key={f.name} className="space-y-1">
            <label className="mono text-white/30 text-[10px] tracking-widest">{f.label}</label>
            <select
              name={f.name}
              value={values[f.name]}
              onChange={handleChange}
              className="w-full bg-black/60 border border-green-500/10 rounded-lg px-3 py-2 mono text-sm text-green-300 focus:outline-none focus:border-green-400/50 transition-all"
            >
              {f.options.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
        ))}
      </div>

      {/* Submit */}
      <button
        onClick={() => onPredict(values)}
        disabled={loading}
        className="w-full relative overflow-hidden bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 hover:border-green-400/60 text-green-400 mono font-bold py-3 rounded-xl transition-all duration-300 tracking-widest text-sm group"
      >
        <span className="relative z-10">
          {loading ? "ANALYZING..." : "▶ RUN RISK ASSESSMENT"}
        </span>
        {loading && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-500/10 to-transparent animate-pulse" />
        )}
      </button>
    </div>
  )
}