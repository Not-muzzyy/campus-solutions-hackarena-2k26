// LeaveApprovals.jsx
import { useState } from 'react'
import { PageHeader, StatusBadge, useToast, Toast } from '../../components/ui/index'
import api from '../../api/axios'

const INIT = [
  {id:'lv1',reference:'#LV-061',student:'Muzzammil C',roll:'BCA6A047',type:'Event / Competition',dates:'22 Mar 2026 · 1 day',desc:'HackArena 2K26 hackathon at JCET Hubballi.',status:'pending'},
  {id:'lv2',reference:'#LV-062',student:'Priya Sharma',roll:'BCA6A028',type:'Medical / Health',dates:'19-20 Mar 2026 · 2 days',desc:'Viral fever. Doctor advised rest. Certificate available.',status:'pending'},
  {id:'lv3',reference:'#LV-063',student:'Arjun Patil',roll:'BCA6A044',type:'Family Emergency',dates:'18 Mar 2026 · 1 day',desc:'Family function, need to travel to home town.',status:'pending'},
  {id:'lv4',reference:'#LV-058',student:'Kavya M',roll:'BCA6B004',type:'Personal Reason',dates:'15 Mar 2026 · 1 day',desc:'Personal work at home.',status:'approved'},
]

export default function LeaveApprovals() {
  const [leaves, setLeaves] = useState(INIT)
  const [remarks, setRemarks] = useState({})
  const { toast, show, hide } = useToast()

  const act = async (id, action) => {
    try {
      await api.patch(`/leave/${id}/action`, { leave_id: id, action, remark: remarks[id] || null })
    } catch {}
    const l = leaves.find(x=>x.id===id)
    setLeaves(prev => prev.map(l => l.id === id ? {...l, status: action} : l))
    show(`${action==='approved'?'Approved':'Rejected'}: ${l?.student}. Student notified.`)
  }

  return (
    <div>
      <PageHeader title="Leave Approvals" subtitle="Review and approve student leave applications — students notified instantly" />
      <div className="px-5 py-4 flex flex-col gap-3">
        {leaves.map(l => (
          <div key={l.id} className="bg-[#0f0f0f] border border-[#262626] rounded-sm p-4">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <StatusBadge status={l.status} />
              <span className="text-[0.82rem] text-[#e5e5e5] font-medium">{l.student}</span>
              <span className="text-[0.75rem] text-[#a3a3a3]">{l.type}</span>
              <span className="font-mono text-[0.58rem] text-[#525252] ml-auto">{l.reference}</span>
            </div>
            <div className="text-[0.77rem] text-[#e5e5e5] mb-1">{l.desc}</div>
            <div className="font-mono text-[0.62rem] text-[#525252] mb-3">{l.dates} · {l.roll}</div>
            {l.status === 'pending' && (
              <div>
                <input value={remarks[l.id]||''} onChange={e=>setRemarks(r=>({...r,[l.id]:e.target.value}))}
                  placeholder="Add remark (optional)..."
                  className="w-full bg-[#161616] border border-[#262626] text-white text-[0.75rem] px-3 py-2 rounded-sm outline-none focus:border-blue-800 mb-2 placeholder-[#525252]"/>
                <div className="flex gap-2">
                  <button onClick={()=>act(l.id,'approved')} className="bg-green-950/20 border border-green-900/25 text-green-400 text-[0.72rem] px-4 py-1.5 rounded-sm hover:bg-green-950/35 transition-colors">Approve</button>
                  <button onClick={()=>act(l.id,'rejected')} className="bg-red-950/20 border border-red-900/20 text-red-400 text-[0.72rem] px-4 py-1.5 rounded-sm hover:bg-red-950/35 transition-colors">Reject</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={hide} />}
    </div>
  )
}
