import { useState, useEffect } from 'react'
import { PageHeader, FormSelect } from '../../components/ui/index'
import api from '../../api/axios'

const ANNOUNCEMENTS = [
  {id:'1',title:'HackArena 2K26 — Registration Open (28/34 read)'},
  {id:'2',title:'Internal Assessment Schedule (31/34 read)'},
  {id:'3',title:'Fee Payment Deadline (25/34 read)'},
]

const STUDENTS = [
  {name:'Muzzammil C',roll:'BCA6A047'},{name:'Zahid Khan',roll:'BCA6A032'},
  {name:'Hamid A',roll:'BCA6A019'},{name:'Ummi Nishath',roll:'BCA6A023'},
  {name:'Priya Sharma',roll:'BCA6A028'},{name:'Ravi Kumar',roll:'BCA6B011'},
  {name:'Sneha G',roll:'BCA6A015'},{name:'Amit R',roll:'BCA6A037'},
  {name:'Kavya M',roll:'BCA6B004'},{name:'Suresh P',roll:'BCA6A041'},
  {name:'Divya K',roll:'BCA6A055'},{name:'Kiran B',roll:'BCA6B018'},
]

const READ_DATA = {'1':[0,1,2,3,4,5,6,7,8,9,10],'2':[0,1,2,3,4,5,6,7,8,9,10,11],'3':[0,1,2,3,4,5,6,7,8]}

export default function ReadReceipts() {
  const [selected, setSelected] = useState('1')
  const [receipts, setReceipts] = useState([])

  useEffect(() => {
    api.get(`/announcements/${selected}/receipts`).then(r => setReceipts(r.data.receipts)).catch(() => {
      const readIdxs = READ_DATA[selected] || []
      setReceipts(STUDENTS.map((s,i) => ({
        student_name: s.name,
        roll_number: s.roll,
        is_read: readIdxs.includes(i),
        read_at: readIdxs.includes(i) ? `${8+Math.floor(i*0.5)}:${String(i*5%60).padStart(2,'0')} AM` : null
      })))
    })
  }, [selected])

  const readCount = receipts.filter(r=>r.is_read).length

  return (
    <div>
      <PageHeader title="Read Receipts" subtitle="See exactly who has and has not read each announcement" />
      <div className="px-5 py-4">
        <div className="max-w-[400px] mb-4">
          <FormSelect label="Select Announcement" value={selected} onChange={e=>setSelected(e.target.value)}
            options={ANNOUNCEMENTS.map(a=>({value:a.id,label:a.title}))} />
        </div>
        <div className="flex gap-2 mb-4 flex-wrap">
          <div className="bg-green-950/10 border border-green-900/20 px-3 py-2 rounded-sm font-mono text-[0.7rem] text-green-400">{readCount} Read</div>
          <div className="bg-red-950/10 border border-red-900/20 px-3 py-2 rounded-sm font-mono text-[0.7rem] text-red-400">{receipts.length - readCount} Unread</div>
          <div className="bg-[#161616] border border-[#262626] px-3 py-2 rounded-sm font-mono text-[0.7rem] text-[#a3a3a3]">{receipts.length ? Math.round(readCount/receipts.length*100) : 0}% Reach</div>
        </div>
        <div className="bg-[#0f0f0f] border border-[#262626] rounded-sm overflow-hidden">
          <div className="grid grid-cols-4 border-b border-[#262626]">
            {['Student','Roll No','Status','Time Read'].map(h=>(
              <div key={h} className="font-mono text-[0.57rem] text-[#525252] uppercase tracking-wide px-3 py-2.5">{h}</div>
            ))}
          </div>
          {receipts.map((r,i) => (
            <div key={i} className="grid grid-cols-4 hover:bg-[#161616] border-b border-[#1e1e1e] last:border-0">
              <div className="px-3 py-2.5 text-[0.78rem] text-[#e5e5e5] font-medium">{r.student_name}</div>
              <div className="px-3 py-2.5 font-mono text-[0.7rem] text-[#525252]">{r.roll_number}</div>
              <div className="px-3 py-2.5">
                <span className={`font-mono text-[0.6rem] px-2 py-0.5 rounded-sm ${r.is_read?'bg-green-950/15 text-green-400 border border-green-900/20':'bg-red-950/15 text-red-400 border border-red-900/20'}`}>
                  {r.is_read ? 'Read' : 'Not Read'}
                </span>
              </div>
              <div className="px-3 py-2.5 font-mono text-[0.7rem] text-[#525252]">{r.read_at || '—'}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
