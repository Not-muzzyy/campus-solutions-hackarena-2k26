// Grievances.jsx
import { useState } from 'react'
import { PageHeader, StatusBadge, useToast, Toast } from '../../components/ui/index'
import api from '../../api/axios'

const INIT = [
  {id:'g1',reference_id:'#GR-A3F7B2',type:'Infrastructure Issue',status:'review',location:'Block B, 2nd Floor',date:'8 Mar 2026'},
  {id:'g2',reference_id:'#GR-C91D44',type:'Canteen / Hygiene',status:'resolved',location:'Canteen Counter 1',date:'22 Feb 2026'},
  {id:'g3',reference_id:'#GR-F28A91',type:'Faculty Misconduct',status:'pending',location:'CSE Department',date:'11 Mar 2026'},
  {id:'g4',reference_id:'#GR-B55E12',type:'Ragging / Bullying',status:'pending',location:'Hostel Block C',date:'13 Mar 2026'},
]

export default function Grievances() {
  const [grievances, setGrievances] = useState(INIT)
  const { toast, show, hide } = useToast()

  const resolve = async (id, ref) => {
    try { await api.patch(`/grievance/${ref}/resolve`) } catch {}
    setGrievances(prev => prev.map(g => g.id===id ? {...g, status:'resolved'} : g))
    show('Grievance marked as resolved.')
  }

  return (
    <div>
      <PageHeader title="Grievance Reports" subtitle="Anonymous student grievances — handle with strict confidentiality" />
      <div className="px-5 py-4">
        <div className="bg-blue-950/10 border border-blue-900/20 border-l-2 border-l-blue-600 px-4 py-2.5 rounded-sm mb-4 text-[0.75rem] text-blue-300">
          All grievances are 100% anonymous. Student identity is AES-256 encrypted and inaccessible. Handle all reports with full confidentiality.
        </div>
        <div className="flex flex-col gap-2.5">
          {grievances.map(g => (
            <div key={g.id} className="bg-[#0f0f0f] border border-[#262626] rounded-sm p-4">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <StatusBadge status={g.status} />
                <span className="text-[0.8rem] text-[#a3a3a3]">{g.type}</span>
                <span className="font-mono text-[0.6rem] text-[#525252] ml-auto">{g.reference_id}</span>
              </div>
              {g.location && <div className="font-mono text-[0.65rem] text-[#525252] mb-0.5">Location: {g.location}</div>}
              <div className="font-mono text-[0.62rem] text-[#525252] mb-3">{g.date} · Anonymous</div>
              {g.status !== 'resolved' && (
                <button onClick={() => resolve(g.id, g.reference_id)}
                  className="bg-green-950/15 border border-green-900/22 text-green-400 text-[0.7rem] px-3 py-1.5 rounded-sm hover:bg-green-950/30 transition-colors">
                  Mark as Resolved
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={hide} />}
    </div>
  )
}
