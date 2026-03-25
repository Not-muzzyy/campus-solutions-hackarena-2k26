// PastPapers.jsx
import { useState } from 'react'
import { PageHeader, useToast, Toast } from '../../components/ui/index'

const PAPERS = [
  {sub:'DBMS',year:'2025',type:'End Sem',code:'DBMS'},{sub:'DBMS',year:'2024',type:'End Sem',code:'DBMS'},
  {sub:'DBMS',year:'2024',type:'Mid Sem',code:'DBMS'},{sub:'Computer Networks',year:'2025',type:'End Sem',code:'CN'},
  {sub:'Computer Networks',year:'2024',type:'End Sem',code:'CN'},{sub:'Machine Learning',year:'2025',type:'End Sem',code:'ML'},
  {sub:'Machine Learning',year:'2024',type:'End Sem',code:'ML'},{sub:'Software Engineering',year:'2025',type:'End Sem',code:'SE'},
  {sub:'Software Engineering',year:'2024',type:'Mid Sem',code:'SE'},
]

export default function PastPapers() {
  const [filter, setFilter] = useState('all')
  const { toast, show, hide } = useToast()
  const filtered = filter === 'all' ? PAPERS : PAPERS.filter(p => p.code === filter)

  return (
    <div>
      <PageHeader title="Previous Year Papers" subtitle="Past papers and study notes uploaded by faculty" />
      <div className="px-5 py-4">
        <div className="flex gap-2 mb-4 flex-wrap">
          {[{v:'all',l:'All'},  {v:'DBMS',l:'DBMS'},{v:'CN',l:'Networks'},{v:'ML',l:'ML'},{v:'SE',l:'Software Eng'}].map(f=>(
            <button key={f.v} onClick={()=>setFilter(f.v)} className={`text-[0.7rem] px-3 py-1.5 rounded-sm border transition-all ${filter===f.v?'bg-red-950/30 border-red-900/40 text-white':'bg-[#161616] border-[#262626] text-[#525252] hover:text-[#a3a3a3]'}`}>{f.l}</button>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
          {filtered.map((p,i) => (
            <div key={i} className="bg-[#0f0f0f] border border-[#262626] rounded-sm p-4 hover:border-[#3a3a3a] transition-colors">
              <div className="text-[0.85rem] text-white font-medium mb-1">{p.sub}</div>
              <div className="font-mono text-[0.62rem] text-[#525252] mb-3">{p.year} · {p.type} · VSKUB</div>
              <button onClick={()=>show(`Downloading ${p.sub} ${p.year}...`)} className="flex items-center gap-1.5 text-[0.7rem] text-red-400 hover:text-red-300 transition-colors">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Download PDF
              </button>
            </div>
          ))}
        </div>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={hide} />}
    </div>
  )
}
