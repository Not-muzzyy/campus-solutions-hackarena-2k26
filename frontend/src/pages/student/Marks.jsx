// Marks.jsx
import { useState, useEffect } from 'react'
import { PageHeader } from '../../components/ui/index'
import api from '../../api/axios'

export default function Marks() {
  const [data, setData] = useState([])
  useEffect(() => {
    api.get('/marks/my').then(r => setData(r.data)).catch(() => {
      setData([
        {subject:'DBMS',subject_code:'CSE601',ia1:18,ia2:22,assignment:8,total:48,max_total:60,percentage:80},
        {subject:'Computer Networks',subject_code:'CSE602',ia1:20,ia2:19,assignment:9,total:48,max_total:60,percentage:80},
        {subject:'Machine Learning',subject_code:'CSE603',ia1:22,ia2:20,assignment:10,total:52,max_total:60,percentage:87},
        {subject:'Software Engineering',subject_code:'CSE604',ia1:17,ia2:21,assignment:8,total:46,max_total:60,percentage:77},
        {subject:'Project',subject_code:'CSE699',ia1:23,ia2:24,assignment:10,total:57,max_total:60,percentage:95},
      ])
    })
  }, [])

  const pctColor = p => p>=80?'#22c55e':p>=60?'#F59E0B':'#f97316'

  return (
    <div>
      <PageHeader title="Internal Marks" subtitle="Live marks dashboard — updated by faculty in real time" />
      <div className="px-5 py-4">
        <div className="bg-green-950/10 border border-green-900/20 border-l-2 border-l-green-600 px-4 py-2.5 rounded-sm mb-4 text-[0.75rem] text-green-400">
          Marks are updated in real time when faculty saves them. Check back after each assessment.
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {data.map(m => (
            <div key={m.subject_code} className="bg-[#0f0f0f] border border-[#262626] rounded-sm p-4">
              <div className="text-[0.85rem] text-white font-medium mb-3">{m.subject}</div>
              {[{l:'IA 1',v:m.ia1,max:25},{l:'IA 2',v:m.ia2,max:25},{l:'Assignment',v:m.assignment,max:10}].map(row=>(
                <div key={row.l} className="flex justify-between text-[0.75rem] mb-2">
                  <span className="text-[#525252]">{row.l}</span>
                  <span className="text-[#e5e5e5]">{row.v ?? '—'}/{row.max}</span>
                </div>
              ))}
              <div className="border-t border-[#262626] mt-2 pt-2 flex justify-between items-center">
                <span className="font-mono text-[0.62rem] text-[#525252] uppercase">Total</span>
                <div className="text-right">
                  <span className="font-display font-black text-[1.1rem]" style={{color:pctColor(m.percentage)}}>{m.total}</span>
                  <span className="text-[#525252] text-[0.72rem]"> / {m.max_total}</span>
                  <span className="font-mono text-[0.62rem] ml-1.5" style={{color:pctColor(m.percentage)}}>({m.percentage}%)</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
