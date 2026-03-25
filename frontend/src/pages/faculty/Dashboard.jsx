// Faculty Dashboard
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { StatCard, PageHeader } from '../../components/ui/index'

export default function FDashboard() {
  const { user } = useAuth()
  const h = new Date().getHours()
  const greeting = h < 12 ? 'Good Morning' : h < 17 ? 'Good Afternoon' : 'Good Evening'
  const [quickApproved, setQuickApproved] = useState([])

  const PENDING = [
    {id:1,student:'Muzzammil C',type:'Event / Competition',dates:'22 Mar 2026 · 1 day',desc:'HackArena 2K26 at JCET Hubballi'},
    {id:2,student:'Priya Sharma',type:'Medical / Health',dates:'19-20 Mar 2026 · 2 days',desc:'Viral fever — doctor advised rest'},
    {id:3,student:'Arjun Patil',type:'Family Emergency',dates:'18 Mar 2026 · 1 day',desc:'Family function, need to travel'},
  ]
  const LOW_ATT = [{name:'Muzzammil C',sub:'DBMS',pct:72},{name:'Ravi Kumar',sub:'Math',pct:69},{name:'Sneha G',sub:'Networks',pct:71},{name:'Amit R',sub:'ML',pct:74}]

  return (
    <div>
      <PageHeader title={`${greeting}, ${user?.name?.split(' ').slice(0,2).join(' ')}`} subtitle="Class overview — BCA 6th Sem, Sec A · NIMS Ballari" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 px-5 mt-4">
        <StatCard number="34" label="Total Students" sub="All enrolled" accent="#3b82f6" />
        <StatCard number={PENDING.filter(p=>!quickApproved.includes(p.id)).length} label="Leave Pending" sub="Awaiting approval" subColor="#f97316" accent="#3b82f6" />
        <StatCard number="4" label="Low Attendance" sub="Below 75%" subColor="#ef4444" accent="#3b82f6" />
        <StatCard number="6" label="Placements Posted" sub="12 enrolled total" accent="#3b82f6" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 px-5 mt-3 pb-5">
        <div className="bg-[#0f0f0f] border border-[#262626] rounded-sm p-4">
          <div className="font-mono text-[0.6rem] text-[#D97706] uppercase tracking-[0.08em] flex items-center gap-1.5 mb-3"><span className="w-1.5 h-1.5 bg-blue-600 rounded-sm"></span>Pending Leave Requests</div>
          <div className="flex flex-col gap-2">
            {PENDING.map(p => (
              <div key={p.id} className="bg-[#161616] border border-[#262626] rounded-sm px-3 py-2.5 flex items-center justify-between gap-2">
                <div>
                  <div className="text-[0.8rem] text-[#e5e5e5] font-medium">{p.student} — {p.type}</div>
                  <div className="font-mono text-[0.62rem] text-[#525252] mt-0.5">{p.dates} · {p.desc}</div>
                </div>
                {quickApproved.includes(p.id) ? (
                  <span className="font-mono text-[0.6rem] text-green-400 bg-green-950/15 border border-green-900/20 px-2 py-0.5 rounded-sm flex-shrink-0">Approved</span>
                ) : (
                  <button onClick={()=>setQuickApproved(prev=>[...prev,p.id])} className="bg-green-950/20 border border-green-900/25 text-green-400 text-[0.7rem] px-2.5 py-1 rounded-sm hover:bg-green-950/35 transition-colors flex-shrink-0">Approve</button>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="bg-[#0f0f0f] border border-[#262626] rounded-sm p-4">
          <div className="font-mono text-[0.6rem] text-[#D97706] uppercase tracking-[0.08em] flex items-center gap-1.5 mb-3"><span className="w-1.5 h-1.5 bg-blue-600 rounded-sm"></span>Low Attendance Alert</div>
          {LOW_ATT.map(s=>(
            <div key={s.name} className="flex items-center justify-between py-2 border-b border-[#1e1e1e] last:border-0">
              <div><div className="text-[0.8rem] text-[#e5e5e5]">{s.name}</div><div className="font-mono text-[0.62rem] text-[#525252]">{s.sub}</div></div>
              <span className="font-display font-bold text-red-400 text-[0.88rem]">{s.pct}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
