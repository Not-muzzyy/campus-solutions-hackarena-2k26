// EnterMarks.jsx
import { useState } from 'react'
import { PageHeader, FormSelect, useToast, Toast } from '../../components/ui/index'
import api from '../../api/axios'

const STUDENTS_MARKS = [
  {id:'s1',name:'Muzzammil C',roll:'BCA6A047',mark:18},{id:'s2',name:'Zahid Khan',roll:'BCA6A032',mark:20},
  {id:'s3',name:'Hamid A',roll:'BCA6A019',mark:22},{id:'s4',name:'Ummi Nishath',roll:'BCA6A023',mark:19},
  {id:'s5',name:'Priya Sharma',roll:'BCA6A028',mark:21},{id:'s6',name:'Ravi Kumar',roll:'BCA6B011',mark:17},
  {id:'s7',name:'Sneha G',roll:'BCA6A015',mark:23},{id:'s8',name:'Amit R',roll:'BCA6A037',mark:16},
]

const getGrade = m => m>=23?'A+':m>=20?'A':m>=17?'B':'C'
const getGradeColor = m => m>=20?'#22c55e':m>=17?'#F59E0B':'#f97316'

export default function EnterMarks() {
  const [subject, setSubject] = useState('DBMS')
  const [type, setType] = useState('IA 1')
  const [marks, setMarks] = useState(Object.fromEntries(STUDENTS_MARKS.map(s=>[s.id,s.mark])))
  const { toast, show, hide } = useToast()

  const save = async () => {
    try {
      const entries = STUDENTS_MARKS.map(s=>({student_id:s.id, marks: parseInt(marks[s.id])||0}))
      await api.post('/marks/enter', {subject, subject_code:'CSE601', assessment_type:type, max_marks:25, entries})
    } catch {}
    show('Marks saved and published. Students can now see their updated marks in real time.')
  }

  return (
    <div>
      <PageHeader title="Enter Internal Marks" subtitle="Update marks — students see them in real time" />
      <div className="px-5 py-4">
        <div className="flex gap-3 mb-4 flex-wrap">
          <div><FormSelect label="Subject" value={subject} onChange={e=>setSubject(e.target.value)} options={['DBMS','Computer Networks','Machine Learning','Software Engineering']} /></div>
          <div><FormSelect label="Assessment" value={type} onChange={e=>setType(e.target.value)} options={['IA 1','IA 2','Assignment']} /></div>
        </div>
        <div className="bg-[#0f0f0f] border border-[#262626] rounded-sm overflow-hidden mb-4">
          <div className="grid grid-cols-4 border-b border-[#262626]">
            {['Roll No','Student Name','Marks (/ 25)','Grade'].map(h=>(
              <div key={h} className="font-mono text-[0.57rem] text-[#525252] uppercase tracking-wide px-3 py-2.5">{h}</div>
            ))}
          </div>
          {STUDENTS_MARKS.map(s => {
            const v = parseInt(marks[s.id])||0
            return (
              <div key={s.id} className="grid grid-cols-4 hover:bg-[#161616] border-b border-[#1e1e1e] last:border-0">
                <div className="px-3 py-2.5 font-mono text-[0.7rem] text-[#525252]">{s.roll}</div>
                <div className="px-3 py-2.5 text-[0.78rem] text-[#e5e5e5] font-medium">{s.name}</div>
                <div className="px-3 py-2.5">
                  <input type="number" min="0" max="25" value={marks[s.id]} onChange={e=>setMarks(m=>({...m,[s.id]:e.target.value}))}
                    className="w-14 bg-[#161616] border border-[#262626] text-white font-mono text-[0.78rem] px-2 py-1 rounded-sm outline-none focus:border-blue-700 text-center"/>
                </div>
                <div className="px-3 py-2.5">
                  <span className="font-display font-bold text-[0.82rem]" style={{color:getGradeColor(v)}}>{getGrade(v)}</span>
                </div>
              </div>
            )
          })}
        </div>
        <button onClick={save} className="bg-blue-700 hover:bg-blue-600 text-white font-semibold text-[0.8rem] px-8 py-2.5 rounded-sm transition-colors">Save & Publish Marks</button>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={hide} />}
    </div>
  )
}
