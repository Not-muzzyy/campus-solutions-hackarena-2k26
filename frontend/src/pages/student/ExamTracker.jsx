// ExamTracker.jsx
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '../../components/ui/index'
export default function ExamTracker() {
  const navigate = useNavigate()
  const EXAMS = [
    {sub:'Database Management Systems',code:'CSE601',date:'18 Mar 2026',time:'10:00 AM',room:'Room 201, Block A',days:5,c:'#ef4444'},
    {sub:'Computer Networks',code:'CSE602',date:'21 Mar 2026',time:'10:00 AM',room:'Room 203, Block A',days:8,c:'#f97316'},
    {sub:'Machine Learning',code:'CSE603',date:'25 Mar 2026',time:'02:00 PM',room:'Lab 3, Block B',days:12,c:'#eab308'},
    {sub:'Software Engineering',code:'CSE604',date:'28 Mar 2026',time:'10:00 AM',room:'Room 105, Block C',days:15,c:'#3b82f6'},
    {sub:'Project Viva Voce',code:'CSE699',date:'2 Apr 2026',time:'09:00 AM',room:'Seminar Hall',days:20,c:'#22c55e'},
  ]
  return (
    <div>
      <PageHeader title="Exam Tracker" subtitle="All upcoming exams with countdowns" />
      <div className="grid grid-cols-3 gap-2.5 px-5 py-4">
        {[{n:'5',l:'Exams Left',c:'#ef4444'},{n:'5',l:'Days to Next',c:'#F59E0B'},{n:'78%',l:'Avg Attendance',c:'#22c55e'}].map(s=>(
          <div key={s.l} className="bg-[#0f0f0f] border border-[#262626] rounded-sm p-3 text-center">
            <div className="font-display font-black text-[1.6rem] leading-none" style={{color:s.c}}>{s.n}</div>
            <div className="font-mono text-[0.58rem] text-[#525252] uppercase mt-1">{s.l}</div>
          </div>
        ))}
      </div>
      <div className="px-5 pb-5 flex flex-col gap-2">
        {EXAMS.map(e=>(
          <div key={e.sub} className="bg-[#0f0f0f] border border-[#262626] rounded-sm p-3 flex items-center gap-3">
            <div className="w-12 h-12 flex flex-col items-center justify-center flex-shrink-0 rounded-sm" style={{background:`${e.c}14`,border:`1px solid ${e.c}33`}}>
              <div className="font-display font-black text-[1.1rem] leading-none" style={{color:e.c}}>{e.days}</div>
              <div className="font-mono text-[0.43rem] uppercase mt-px" style={{color:`${e.c}99`}}>days</div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[0.86rem] text-white font-medium">{e.sub}</div>
              <div className="font-mono text-[0.65rem] text-[#a3a3a3] mt-0.5">{e.code} · {e.date} · {e.time}</div>
              <div className="font-mono text-[0.62rem] text-[#525252]">{e.room}</div>
            </div>
            <button onClick={()=>navigate('/student/ai')} className="bg-[#161616] border border-[#262626] text-[#a3a3a3] text-[0.68rem] px-2.5 py-1.5 rounded-sm hover:text-white hover:border-red-900/30 transition-colors flex-shrink-0">Ask AI</button>
          </div>
        ))}
      </div>
    </div>
  )
}
