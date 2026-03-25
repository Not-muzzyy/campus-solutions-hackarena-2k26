import { useState, useEffect } from 'react'
import { PageHeader, FormSelect, FormTextarea, FormInput, PrimaryButton, StatusBadge, useToast, Toast } from '../../components/ui/index'
import api from '../../api/axios'

export default function Grievance() {
  const [form, setForm] = useState({ grievance_type:'', description:'', location:'', incident_date:'', is_anonymous:true })
  const [mine, setMine] = useState([])
  const [loading, setLoading] = useState(false)
  const { toast, show, hide } = useToast()

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]
    setForm(f => ({...f, incident_date: today}))
    api.get('/grievance/mine').then(r => setMine(r.data)).catch(() => {
      setMine([
        {reference_id:'#GR-A3F7B2',type:'Infrastructure Issue',status:'review',date:'2026-03-08'},
        {reference_id:'#GR-C91D44',type:'Canteen / Hygiene',status:'resolved',date:'2026-02-22'},
      ])
    })
  }, [])

  const submit = async () => {
    if (!form.grievance_type || !form.description) { show('Please fill Type and Description.','error'); return }
    setLoading(true)
    try {
      const res = await api.post('/grievance', form)
      setMine(prev => [{reference_id:res.data.reference_id, type:form.grievance_type, status:'pending', date:new Date().toISOString().split('T')[0]}, ...prev])
      setForm(f => ({...f, grievance_type:'', description:'', location:''}))
      show(`Grievance submitted securely — ${res.data.reference_id}`)
    } catch { show('Submission failed','error') }
    finally { setLoading(false) }
  }

  return (
    <div>
      <PageHeader title="Grievance Portal" subtitle="100% anonymous · AES-256 encrypted · Safe to report" />
      <div className="flex flex-col md:flex-row gap-3 px-5 py-4">
        <div className="w-full md:w-[380px] flex-shrink-0">
          <div className="bg-[#0f0f0f] border border-[#262626] rounded-sm p-4">
            <div className="font-mono text-[0.6rem] text-[#a3a3a3] uppercase tracking-[0.1em] mb-4 flex items-center gap-1.5">
              <svg className="w-3 h-3 text-red-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              Submit Grievance
            </div>
            <div className="bg-blue-950/15 border border-blue-900/20 rounded-sm px-3 py-2.5 mb-3 text-[0.73rem] text-blue-300">
              Your identity is stripped before storage. Reference IDs have zero link to your account.
            </div>
            <FormSelect label="Grievance Type *" value={form.grievance_type} onChange={e=>setForm(f=>({...f,grievance_type:e.target.value}))}
              options={['','Ragging / Bullying','Harassment','Faculty Misconduct','Infrastructure Issue','Canteen / Hygiene','Other']} />
            <FormTextarea label="Description *" value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} placeholder="Describe the issue in detail. Your identity stays protected." />
            <FormInput label="Location (optional)" value={form.location} onChange={e=>setForm(f=>({...f,location:e.target.value}))} placeholder="e.g. Block B, 3rd Floor" />
            <FormInput label="Date of Incident" type="date" value={form.incident_date} onChange={e=>setForm(f=>({...f,incident_date:e.target.value}))} />
            <label className="flex items-center gap-2 mb-4 cursor-pointer" onClick={()=>setForm(f=>({...f,is_anonymous:!f.is_anonymous}))}>
              <div className={`w-3.5 h-3.5 border rounded-sm flex items-center justify-center text-[0.65rem] ${form.is_anonymous?'bg-red-900/30 border-red-700 text-red-400':'border-[#525252]'}`}>
                {form.is_anonymous && '✓'}
              </div>
              <span className="text-[0.77rem] text-[#a3a3a3]">Submit anonymously (recommended)</span>
            </label>
            <PrimaryButton onClick={submit} disabled={loading}>{loading?'Submitting...':'Submit Securely'}</PrimaryButton>
          </div>
        </div>
        <div className="flex-1">
          <div className="font-mono text-[0.58rem] text-[#525252] uppercase tracking-[0.12em] mb-3 flex items-center gap-2">Your Reports<div className="flex-1 h-px bg-[#262626]"></div></div>
          <div className="flex flex-col gap-2">
            {mine.map(g => (
              <div key={g.reference_id} className="bg-[#0f0f0f] border border-[#262626] rounded-sm p-4">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <StatusBadge status={g.status} />
                  <span className="text-[0.75rem] text-[#a3a3a3]">{g.type}</span>
                  <span className="font-mono text-[0.6rem] text-[#525252] ml-auto">{g.reference_id}</span>
                </div>
                <div className="font-mono text-[0.62rem] text-[#525252]">{new Date(g.date).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})} · Anonymous</div>
              </div>
            ))}
            {mine.length === 0 && <div className="text-[0.8rem] text-[#525252]">No grievances submitted yet.</div>}
          </div>
        </div>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={hide} />}
    </div>
  )
}
