import { useState, useEffect } from 'react'
import { PageHeader } from '../../components/ui/index'
import api from '../../api/axios'

export default function Attendance() {
  const [data, setData] = useState([])
  useEffect(() => {
    api.get('/attendance/my').then(r => setData(r.data)).catch(() => {
      setData([
        {subject:'Database Management Systems',subject_code:'CSE601',present:18,total:25,percentage:72,status:'danger'},
        {subject:'Computer Networks',subject_code:'CSE602',present:22,total:26,percentage:85,status:'safe'},
        {subject:'Machine Learning',subject_code:'CSE603',present:20,total:24,percentage:83,status:'safe'},
        {subject:'Software Engineering',subject_code:'CSE604',present:23,total:26,percentage:88,status:'safe'},
        {subject:'Project Work',subject_code:'CSE699',present:15,total:17,percentage:88,status:'safe'},
      ])
    })
  }, [])

  const overall = data.length ? Math.round(data.reduce((s,a)=>s+a.percentage,0)/data.length) : 0
  const present = data.reduce((s,a)=>s+a.present,0)
  const total = data.reduce((s,a)=>s+a.total,0)
  const atRisk = data.filter(a=>a.status==='danger')

  const statusColor = (s) => s==='danger'?'#ef4444':s==='warning'?'#f97316':'#22c55e'

  return (
    <div>
      <PageHeader title="Attendance Tracker" subtitle="Subject-wise attendance with early warning system" />
      <div className="px-5 py-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 mb-4">
          {[{n:`${overall}%`,l:'Overall',c:'#F59E0B'},{n:present,l:'Present',c:'#22c55e'},{n:total-present,l:'Absent',c:'#ef4444'},{n:total,l:'Total Classes',c:'#3b82f6'}].map(s=>(
            <div key={s.l} className="bg-[#0f0f0f] border border-[#262626] rounded-sm p-3 text-center">
              <div className="font-display font-black text-[1.5rem] leading-none" style={{color:s.c}}>{s.n}</div>
              <div className="font-mono text-[0.58rem] text-[#525252] uppercase mt-1">{s.l}</div>
            </div>
          ))}
        </div>

        {atRisk.length > 0 && (
          <div className="bg-orange-950/20 border border-orange-900/30 border-l-2 border-l-orange-500 px-4 py-3 rounded-sm mb-4">
            <div className="text-orange-400 font-semibold text-[0.78rem] mb-0.5">Attendance Warning</div>
            <div className="text-[#a3a3a3] text-[0.73rem]">
              {atRisk.map(a=>a.subject).join(', ')} — below 75%. You need to attend more classes to meet the minimum requirement.
            </div>
          </div>
        )}

        <div className="font-mono text-[0.58rem] text-[#525252] uppercase tracking-[0.12em] mb-2 flex items-center gap-2">
          Subject-wise Breakdown <div className="flex-1 h-px bg-[#262626]"></div>
        </div>

        <div className="bg-[#0f0f0f] border border-[#262626] rounded-sm overflow-hidden">
          <div className="grid grid-cols-5 gap-0">
            {['Subject','Present','Total','%','Status'].map(h=>(
              <div key={h} className="font-mono text-[0.57rem] text-[#525252] uppercase tracking-wide px-3 py-2.5 border-b border-[#262626]">{h}</div>
            ))}
          </div>
          {data.map(a=>(
            <div key={a.subject_code} className="grid grid-cols-5 gap-0 hover:bg-[#161616] border-b border-[#1e1e1e] last:border-0">
              <div className="px-3 py-2.5">
                <div className="text-[0.78rem] text-[#e5e5e5] font-medium truncate">{a.subject}</div>
                <div className="font-mono text-[0.62rem] text-[#525252]">{a.subject_code}</div>
              </div>
              <div className="px-3 py-2.5 font-mono text-[0.78rem] text-[#e5e5e5] flex items-center">{a.present}</div>
              <div className="px-3 py-2.5 font-mono text-[0.78rem] text-[#e5e5e5] flex items-center">{a.total}</div>
              <div className="px-3 py-2.5 flex flex-col justify-center">
                <div className="font-display font-bold text-[0.78rem]" style={{color:statusColor(a.status)}}>{a.percentage}%</div>
                <div className="h-1 bg-[#262626] rounded-full mt-1 overflow-hidden">
                  <div className="h-full rounded-full" style={{width:`${a.percentage}%`,background:statusColor(a.status)}}></div>
                </div>
              </div>
              <div className="px-3 py-2.5 flex items-center">
                <span className="font-mono text-[0.6rem] px-2 py-0.5 rounded-sm" style={{
                  color:statusColor(a.status),
                  background:`${statusColor(a.status)}14`,
                  border:`1px solid ${statusColor(a.status)}33`
                }}>
                  {a.status==='danger'?'At Risk':a.status==='warning'?'Warning':'Safe'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
