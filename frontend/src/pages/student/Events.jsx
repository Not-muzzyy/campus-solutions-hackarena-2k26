import { useState } from 'react'
import { PageHeader, useToast, Toast } from '../../components/ui/index'

const EVENTS = [
  {id:1,type:'hackathon',title:'HackArena 2K26',desc:'Inter-college hackathon at JCET Hubballi. Domains: Campus Solutions, FinTech, EdTech. PPT deadline: 18 March.',date:'22 March 2026 · JCET Hubballi'},
  {id:2,type:'seminar',title:'Cybersecurity & Ethical Hacking',desc:'Guest lecture by Mr. Rajan Kumar (ISRO). All CSE and ISE students encouraged. Entry free.',date:'15 March 2026 · Seminar Hall, Block B'},
  {id:3,type:'workshop',title:'Python for Data Science Workshop',desc:'2-day hands-on workshop on Python, Pandas, and ML basics. Certificate provided. Limited seats.',date:'20-21 March 2026 · Lab 2, Block B'},
  {id:4,type:'sports',title:'Inter-College Cricket Tournament',desc:'Annual cricket tournament. Register your team of 11. College team selections next week.',date:'25 March 2026 · College Ground'},
  {id:5,type:'seminar',title:'Career Guidance — IT Industry',desc:'Industry expert panel on career paths in IT, placements, and higher education after BCA.',date:'18 March 2026 · Seminar Hall'},
  {id:6,type:'workshop',title:'Resume Building & LinkedIn',desc:'Build a job-ready resume and optimize your LinkedIn profile. Placement cell initiative.',date:'19 March 2026 · Conference Room'},
]

const typeStyles = {
  hackathon:'bg-purple-950/20 text-purple-400 border border-purple-900/25',
  seminar:  'bg-blue-950/20 text-blue-400 border border-blue-900/25',
  workshop: 'bg-amber-950/20 text-amber-400 border border-amber-900/25',
  sports:   'bg-green-950/20 text-green-400 border border-green-900/25',
}

export default function Events() {
  const [registered, setRegistered] = useState(new Set())
  const { toast, show, hide } = useToast()

  const register = (ev) => {
    setRegistered(prev => new Set([...prev, ev.id]))
    show(`Registered for ${ev.title}!`)
  }

  return (
    <div>
      <PageHeader title="Events & Activities" subtitle="College events, seminars, workshops — register and get reminders" />
      <div className="px-5 py-4 grid grid-cols-1 md:grid-cols-2 gap-2.5">
        {EVENTS.map(ev => (
          <div key={ev.id} className="bg-[#0f0f0f] border border-[#262626] rounded-sm p-4 hover:border-[#3a3a3a] transition-colors">
            <span className={`font-mono text-[0.58rem] px-2 py-0.5 rounded-sm mb-3 inline-block ${typeStyles[ev.type]}`}>
              {ev.type.charAt(0).toUpperCase()+ev.type.slice(1)}
            </span>
            <div className="text-[0.9rem] text-white font-medium mb-1.5">{ev.title}</div>
            <div className="text-[0.75rem] text-[#a3a3a3] leading-relaxed mb-2">{ev.desc}</div>
            <div className="font-mono text-[0.62rem] text-[#525252] mb-3">{ev.date}</div>
            <button
              onClick={() => !registered.has(ev.id) && register(ev)}
              className={`w-full py-2 text-[0.75rem] font-semibold rounded-sm transition-colors ${
                registered.has(ev.id)
                  ? 'bg-green-950/15 border border-green-900/25 text-green-400 cursor-default'
                  : 'bg-red-700 hover:bg-red-600 text-white'
              }`}>
              {registered.has(ev.id) ? 'Registered' : 'Register Now'}
            </button>
          </div>
        ))}
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={hide} />}
    </div>
  )
}
