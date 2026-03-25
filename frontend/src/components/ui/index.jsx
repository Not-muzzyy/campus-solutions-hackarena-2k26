import { useState, useEffect, useCallback } from 'react'

export function PageHeader({ icon, title, subtitle }) {
  return (
    <div className="px-5 py-4 border-b border-[#1e1e1e] sticky top-0 bg-[#080808] z-10">
      <h2 className="font-['Syne'] font-bold text-[1.05rem] text-white flex items-center gap-2">
        {icon && <span className="text-red-600">{icon}</span>}
        {title}
      </h2>
      {subtitle && <p className="text-[0.72rem] text-[#525252] mt-0.5 ml-6">{subtitle}</p>}
    </div>
  )
}

export function StatCard({ number, label, sub, subColor = '#22c55e', accent = '#B91C1C' }) {
  return (
    <div className="bg-[#0f0f0f] border border-[#1e1e1e] rounded-sm p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-0.5 h-full" style={{ background: accent }} />
      <div className="font-['Syne'] font-black text-[1.5rem] text-[#F59E0B] leading-none">{number}</div>
      <div className="font-['DM_Mono'] text-[0.58rem] text-[#525252] uppercase tracking-wide mt-1">{label}</div>
      {sub && <div className="text-[0.63rem] mt-0.5" style={{ color: subColor }}>{sub}</div>}
    </div>
  )
}

export function Card({ children, className = '' }) {
  return <div className={`bg-[#0f0f0f] border border-[#1e1e1e] rounded-sm ${className}`}>{children}</div>
}

export function SectionTitle({ children }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <span className="font-['DM_Mono'] text-[0.57rem] text-[#525252] uppercase tracking-[0.12em]">{children}</span>
      <div className="flex-1 h-px bg-[#1e1e1e]" />
    </div>
  )
}

export function StatusBadge({ status }) {
  const s = {
    pending:  'bg-amber-950/30 text-amber-400 border border-amber-900/30',
    approved: 'bg-green-950/20 text-green-400 border border-green-900/25',
    rejected: 'bg-red-950/20 text-red-400 border border-red-900/25',
    review:   'bg-blue-950/20 text-blue-400 border border-blue-900/25',
    resolved: 'bg-green-950/20 text-green-400 border border-green-900/25',
  }
  return (
    <span className={`font-['DM_Mono'] text-[0.55rem] px-2 py-0.5 rounded-sm ${s[status] || s.pending}`}>
      {status?.charAt(0).toUpperCase() + status?.slice(1)}
    </span>
  )
}

export function Input({ label, ...props }) {
  return (
    <div className="mb-3">
      {label && <label className="block font-['DM_Mono'] text-[0.57rem] text-[#525252] uppercase tracking-wide mb-1">{label}</label>}
      <input className="w-full bg-[#161616] border border-[#1e1e1e] text-white text-[0.8rem] px-3 py-2.5 rounded-sm outline-none focus:border-red-800/60 transition-colors placeholder-[#525252]" {...props} />
    </div>
  )
}

export function Select({ label, options = [], ...props }) {
  return (
    <div className="mb-3">
      {label && <label className="block font-['DM_Mono'] text-[0.57rem] text-[#525252] uppercase tracking-wide mb-1">{label}</label>}
      <select className="w-full bg-[#161616] border border-[#1e1e1e] text-white text-[0.8rem] px-3 py-2.5 rounded-sm outline-none focus:border-red-800/60 transition-colors" {...props}>
        {options.map(o => typeof o === 'string' ? <option key={o} value={o}>{o}</option> : <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  )
}

export function Textarea({ label, ...props }) {
  return (
    <div className="mb-3">
      {label && <label className="block font-['DM_Mono'] text-[0.57rem] text-[#525252] uppercase tracking-wide mb-1">{label}</label>}
      <textarea className="w-full bg-[#161616] border border-[#1e1e1e] text-white text-[0.8rem] px-3 py-2.5 rounded-sm outline-none focus:border-red-800/60 resize-y min-h-[80px] placeholder-[#525252]" {...props} />
    </div>
  )
}

export function PrimaryBtn({ children, onClick, disabled, className = '' }) {
  return (
    <button onClick={onClick} disabled={disabled}
      className={`w-full bg-red-700 hover:bg-red-600 disabled:bg-[#262626] disabled:text-[#525252] disabled:cursor-not-allowed text-white font-semibold text-[0.78rem] py-2.5 rounded-sm transition-colors ${className}`}>
      {children}
    </button>
  )
}

export function BlueBtn({ children, onClick, disabled, className = '' }) {
  return (
    <button onClick={onClick} disabled={disabled}
      className={`w-full bg-blue-700 hover:bg-blue-600 disabled:bg-[#262626] disabled:text-[#525252] disabled:cursor-not-allowed text-white font-semibold text-[0.78rem] py-2.5 rounded-sm transition-colors ${className}`}>
      {children}
    </button>
  )
}

export function Toast({ message, type = 'success', onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t) }, [onClose])
  return (
    <div className={`fixed bottom-16 md:bottom-6 left-1/2 -translate-x-1/2 z-[999] px-4 py-2.5 text-[0.78rem] text-[#e5e5e5] rounded-sm border whitespace-nowrap max-w-[90vw] overflow-hidden text-ellipsis shadow-lg ${
      type === 'error' ? 'bg-[#0f0f0f] border-red-900 border-l-2 border-l-red-600' : 'bg-[#0f0f0f] border-[#262626] border-l-2 border-l-green-500'
    }`}>{message}</div>
  )
}

export function useToast() {
  const [toast, setToast] = useState(null)
  const show = useCallback((message, type = 'success') => setToast({ message, type }), [])
  const hide = useCallback(() => setToast(null), [])
  return { toast, show, hide }
}

// Aliases — pages import these names
export const FormInput    = Input
export const FormSelect   = Select
export const FormTextarea = Textarea
export const PrimaryButton = PrimaryBtn
export const BlueButton   = BlueBtn
