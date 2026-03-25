import { useState, useRef, useEffect } from 'react'
import { PageHeader } from '../../components/ui/index'
import api from '../../api/axios'

const MODES = [
  { key: 'qa',    label: 'Campus Q&A' },
  { key: 'study', label: 'Study Helper' },
  { key: 'exam',  label: 'Exam Prep' },
  { key: 'debug', label: 'Code Debug' },
]

const MODE_HINTS = {
  qa:    'Campus Q&A mode — Ask about exam dates, timetables, attendance rules, fees, or college policies.',
  study: 'Study Helper mode — Ask me to explain any concept from your BCA subjects with examples.',
  exam:  'Exam Prep mode — Ask for important questions, key topics, or quick revision notes.',
  debug: 'Code Debug mode — Paste your code with the error and I will find the fix.',
}

export default function AIAssistant() {
  const [messages, setMessages] = useState([
    { role: 'bot', text: "Hello! I am CampusIQ AI for NIMS, Ballari.\n\nI know your college syllabus, exam schedules, timetables, and policies. Ask me anything. Try:\n· When is my DBMS exam?\n· Explain normalization in DBMS\n· Give 10 important questions for Computer Networks\n· Debug my Python code", time: now() }
  ])
  const [input, setInput] = useState('')
  const [mode, setMode] = useState('qa')
  const [loading, setLoading] = useState(false)
  const [language, setLanguage] = useState('en')
  const endRef = useRef(null)

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  function now() { return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }

  const switchMode = (m) => {
    setMode(m)
    setMessages(prev => [...prev, { role: 'bot', text: MODE_HINTS[m], time: now() }])
  }

  const send = async () => {
    if (!input.trim() || loading) return
    const text = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', text, time: now() }])
    setLoading(true)

    try {
      const res = await api.post('/ai/ask', { query: text, mode, language })
      setMessages(prev => [...prev, { role: 'bot', text: res.data.answer, sources: res.data.source_documents, time: now() }])
    } catch {
      setMessages(prev => [...prev, { role: 'bot', text: 'Connection error. Please check your internet and try again.', time: now() }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <PageHeader title="AI Academic Assistant" subtitle="Ask about your college, subjects, or exams — powered by LLaMA 3.1 + RAG" />

      {/* Mode Tabs */}
      <div className="flex items-center gap-1.5 px-4 py-2 bg-[#0f0f0f] border-b border-[#262626] overflow-x-auto flex-shrink-0">
        {MODES.map(m => (
          <button key={m.key} onClick={() => switchMode(m.key)}
            className={`text-[0.7rem] px-3 py-1.5 rounded-sm border flex-shrink-0 transition-all ${
              mode === m.key ? 'bg-red-950/30 border-red-900/40 text-white' : 'bg-[#161616] border-[#262626] text-[#525252] hover:text-[#a3a3a3]'
            }`}>
            {m.label}
          </button>
        ))}
        <div className="ml-auto flex-shrink-0">
          <select value={language} onChange={e => setLanguage(e.target.value)}
            className="bg-[#161616] border border-[#262626] text-[#a3a3a3] text-[0.68rem] px-2 py-1 rounded-sm outline-none">
            <option value="en">EN</option>
            <option value="hi">HI</option>
            <option value="kn">KN</option>
            <option value="te">TE</option>
          </select>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-2 max-w-[78%] ${msg.role === 'user' ? 'self-end flex-row-reverse' : ''}`}>
            <div className={`w-6 h-6 flex-shrink-0 self-end flex items-center justify-center font-mono text-[0.58rem] rounded-sm border ${
              msg.role === 'user' ? 'bg-amber-950/20 border-amber-900/30 text-amber-500' : 'bg-[#161616] border-[#262626] text-red-500'
            }`}>
              {msg.role === 'user' ? 'ME' : 'IQ'}
            </div>
            <div>
              <div className={`px-3 py-2.5 text-[0.82rem] leading-relaxed rounded-sm border ${
                msg.role === 'user'
                  ? 'bg-red-950/15 border-red-900/25 text-[#e5e5e5]'
                  : 'bg-[#0f0f0f] border-[#262626] text-[#e5e5e5]'
              }`}>
                {msg.text.split('\n').map((line, j) => <span key={j}>{line}<br/></span>)}
              </div>
              {msg.sources?.length > 0 && (
                <div className="mt-1 font-mono text-[0.58rem] text-[#525252]">
                  Source: {msg.sources.join(', ')}
                </div>
              )}
              <div className={`font-mono text-[0.58rem] text-[#525252] mt-0.5 ${msg.role === 'user' ? 'text-right' : ''}`}>{msg.time}</div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-2 max-w-[78%]">
            <div className="w-6 h-6 flex-shrink-0 self-end flex items-center justify-center font-mono text-[0.58rem] rounded-sm border bg-[#161616] border-[#262626] text-red-500">IQ</div>
            <div className="bg-[#0f0f0f] border border-[#262626] px-4 py-3 rounded-sm">
              <div className="flex gap-1.5 items-center">
                <div className="typing-dot"></div><div className="typing-dot"></div><div className="typing-dot"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={endRef}></div>
      </div>

      {/* Input */}
      <div className="px-4 py-3 bg-[#0f0f0f] border-t border-[#262626] flex gap-2 flex-shrink-0">
        <input
          value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="Ask about your college, subjects, or paste code..."
          className="flex-1 bg-[#161616] border border-[#262626] text-white text-[0.82rem] px-3 py-2.5 rounded-sm outline-none focus:border-red-800 placeholder-[#525252]"
        />
        <button onClick={send} disabled={loading}
          className="bg-red-700 hover:bg-red-600 disabled:bg-[#262626] disabled:text-[#525252] text-white font-semibold text-[0.78rem] px-4 py-2.5 rounded-sm transition-colors whitespace-nowrap">
          Send
        </button>
      </div>
    </div>
  )
}
