// Leave.jsx
import { useState, useEffect } from 'react'
import { PageHeader, FormInput, FormSelect, FormTextarea, PrimaryButton, StatusBadge, useToast, Toast } from '../../components/ui/index'
import api from '../../api/axios'

export default function Leave() {
  const [records, setRecords] = useState([])
  const [form, setForm] = useState({ leave_type:'', from_date:'', to_date:'', reason:'', faculty_id:'fac1' })
  const [loading, setLoading] = useState(false)
  const { toast, show, hide } = useToast()

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]
    const tom = new Date(); tom.setDate(tom.getDate()+1)
    setForm(f => ({...f, from_date: today, to_date: tom.toISOString().split('T')[0]}))
    api.get('/leave').then(r => setRecords(r.data)).catch(() => {
      setRecords([
        {id:'1',reference:'#LV-042',leave_type:'Medical',from_date:'28 Feb 2026',to_date:'1 Mar 2026',days:2,reason:'Fever and viral infection',status:'approved',faculty_name:'Prof. Anand Kumar',remark:'Approved. Get well soon.'},
        {id:'2',reference:'#LV-051',leave_type:'Event',from_date:'22 Mar 2026',to_date:'22 Mar 2026',days:1,reason:'HackArena 2K26 at JCET Hubballi',status:'pending',faculty_name:'Prof. Anand Kumar',remark:null},
        {id:'3',reference:'#LV-038',leave_type:'Personal',from_date:'10 Feb 2026',to_date:'10 Feb 2026',days:1,reason:'Personal work at home',status:'rejected',faculty_name:'Prof. Suma Patil',remark:'Rejected. Internal assessment same day.'},
      ])
    })
  }, [])

  const submit = async () => {
    if (!form.leave_type || !form.from_date || !form.to_date || !form.reason) { show('Please fill all required fields.','error'); return }
    setLoading(true)
    try {
      const res = await api.post('/leave', form)
      setRecords(prev => [res.data, ...prev])
      setForm(f => ({...f, leave_type:'', reason:''}))
      show(`Leave submitted — ${res.data.reference}`)
    } catch { show('Submission failed','error') }
    finally { setLoading(false) }
  }

  const remarkStyle = s => s==='approved'?'border-l-green-600 bg-green-950/10 text-green-400':'border-l-red-600 bg-red-950/10 text-red-400'

  return (
    <div>
      <PageHeader title="Leave Application" subtitle="Submit leave — faculty approves digitally, you get notified" />
      <div className="flex flex-col md:flex-row gap-3 px-5 py-4">
        <div className="w-full md:w-[380px] flex-shrink-0">
          <div className="bg-[#0f0f0f] border border-[#262626] rounded-sm p-4">
            <div className="font-mono text-[0.6rem] text-[#a3a3a3] uppercase tracking-[0.1em] mb-4 flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-red-700 rounded-sm"></span>Apply for Leave</div>
            <FormSelect label="Leave Type *" value={form.leave_type} onChange={e=>setForm(f=>({...f,leave_type:e.target.value}))}
              options={['','Medical / Health','Family Emergency','Personal Reason','Event / Competition','Exam Preparation','Other']} />
            <div className="grid grid-cols-2 gap-2">
              <FormInput label="From Date *" type="date" value={form.from_date} onChange={e=>setForm(f=>({...f,from_date:e.target.value}))} />
              <FormInput label="To Date *" type="date" value={form.to_date} onChange={e=>setForm(f=>({...f,to_date:e.target.value}))} />
            </div>
            <FormTextarea label="Reason *" value={form.reason} onChange={e=>setForm(f=>({...f,reason:e.target.value}))} placeholder="Briefly explain your reason..." />
            <FormSelect label="Faculty" value={form.faculty_id} onChange={e=>setForm(f=>({...f,faculty_id:e.target.value}))}
              options={[{value:'fac1',label:'Prof. Anand Kumar — Class Coordinator'},{value:'fac2',label:'Prof. Suma Patil — CSE HOD'}]} />
            <PrimaryButton onClick={submit} disabled={loading}>{loading?'Submitting...':'Submit Leave Request'}</PrimaryButton>
          </div>
        </div>
        <div className="flex-1">
          <div className="font-mono text-[0.58rem] text-[#525252] uppercase tracking-[0.12em] mb-3 flex items-center gap-2">Your Leave Records<div className="flex-1 h-px bg-[#262626]"></div></div>
          <div className="flex flex-col gap-2">
            {records.map(r => (
              <div key={r.id} className="bg-[#0f0f0f] border border-[#262626] rounded-sm p-4">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <StatusBadge status={r.status} />
                  <span className="text-[0.75rem] text-[#e5e5e5] font-medium">{r.leave_type}</span>
                  <span className="font-mono text-[0.58rem] text-[#525252] ml-auto">{r.reference}</span>
                </div>
                <div className="text-[0.77rem] text-[#e5e5e5] mb-1.5">{r.reason}</div>
                <div className="font-mono text-[0.62rem] text-[#525252]">{r.days} day{r.days>1?'s':''} · {r.from_date} · {r.faculty_name}</div>
                {r.remark && (
                  <div className={`mt-2 pl-3 border-l-2 py-1.5 rounded-sm text-[0.7rem] ${remarkStyle(r.status)}`}>{r.remark}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={hide} />}
    </div>
  )
}
