import { useState } from 'react'
import { PageHeader, useToast, Toast } from '../../components/ui/index'

const INITIAL = [
  {id:1,type:'lost',item:'Calculator — Casio FX-991',loc:'Library, Reading Area',date:'13 Mar 2026'},
  {id:2,type:'found',item:'Water Bottle — Blue, 1L',loc:'Canteen, near window',date:'13 Mar 2026'},
  {id:3,type:'lost',item:'ID Card — Ravi Kumar',loc:'CSE Lab, Block B',date:'12 Mar 2026'},
  {id:4,type:'found',item:'Spectacles — Black Frame',loc:'Seminar Hall, Row 3',date:'11 Mar 2026'},
  {id:5,type:'lost',item:'ML Subject Notebook',loc:'Last seen in Lab 3',date:'10 Mar 2026'},
  {id:6,type:'found',item:'USB Pendrive — 16GB',loc:'Computer Lab 2',date:'9 Mar 2026'},
]

export default function LostFound() {
  const [items, setItems] = useState(INITIAL)
  const [filter, setFilter] = useState('all')
  const { toast, show, hide } = useToast()

  const report = () => {
    const item = window.prompt('Item name and description:')
    if (!item) return
    const type = window.confirm('Is it LOST? (OK = Lost, Cancel = Found)') ? 'lost' : 'found'
    const loc = window.prompt('Location on campus:') || 'Unknown'
    const today = new Date().toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})
    setItems(prev => [{id:Date.now(),type,item,loc,date:today}, ...prev])
    show(`${type==='lost'?'Lost':'Found'} item reported.`)
  }

  const filtered = filter === 'all' ? items : items.filter(i => i.type === filter)

  return (
    <div>
      <PageHeader title="Lost & Found" subtitle="Report lost items or claim found ones on campus" />
      <div className="px-5 py-4">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div className="flex gap-2">
            {['all','lost','found'].map(f=>(
              <button key={f} onClick={()=>setFilter(f)} className={`text-[0.7rem] px-3 py-1.5 rounded-sm border transition-all ${filter===f?'bg-red-950/25 border-red-900/35 text-white':'bg-[#161616] border-[#262626] text-[#525252]'}`}>
                {f.charAt(0).toUpperCase()+f.slice(1)}
              </button>
            ))}
          </div>
          <button onClick={report} className="bg-red-700 hover:bg-red-600 text-white text-[0.72rem] px-3 py-1.5 rounded-sm transition-colors">Report Item</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
          {filtered.map(item => (
            <div key={item.id} className="bg-[#0f0f0f] border border-[#262626] rounded-sm p-4 hover:border-[#3a3a3a] transition-colors">
              <div className={`font-mono text-[0.57rem] font-medium uppercase tracking-wide mb-2 flex items-center gap-1.5 ${item.type==='lost'?'text-red-400':'text-green-400'}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${item.type==='lost'?'bg-red-500':'bg-green-500'}`}></div>
                {item.type.toUpperCase()}
              </div>
              <div className="text-[0.84rem] text-white font-medium mb-1">{item.item}</div>
              <div className="font-mono text-[0.65rem] text-[#a3a3a3] mb-1">{item.loc}</div>
              <div className="font-mono text-[0.62rem] text-[#525252]">{item.date}</div>
            </div>
          ))}
        </div>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={hide} />}
    </div>
  )
}
