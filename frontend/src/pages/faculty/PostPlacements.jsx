import { useState } from 'react'
import { PageHeader, FormInput, FormSelect, FormTextarea, BlueButton, useToast, Toast } from '../../components/ui/index'
import api from '../../api/axios'

export default function PostPlacements() {
  const [form, setForm] = useState({company:'',role:'',placement_type:'internship',compensation:'',location:'',eligibility:'',deadline:'',description:''})
  const [posted, setPosted] = useState([
    {id:1,company:'Infosys',role:'Systems Engineer',placement_type:'placement',deadline:'25 Mar 2026',enrolled_count:8},
    {id:2,company:'TCS iON',role:'Digital Intern',placement_type:'internship',deadline:'20 Mar 2026',enrolled_count:12},
    {id:3,company:'Wipro WILP',role:'ML Intern',placement_type:'internship',deadline:'30 Mar 2026',enrolled_count:5},
  ])
  const [loading, setLoading] = useState(false)
  const { toast, show, hide } = useToast()

  const submit = async () => {
    if (!form.company || !form.role) { show('Please fill Company and Role.','error'); return }
    setLoading(true)
    try {
      const res = await api.post('/placements', {...form, required_skills:[]})
      setPosted(prev => [{id:Date.now(),...form,enrolled_count:0}, ...prev])
      setForm({company:'',role:'',placement_type:'internship',compensation:'',location:'',eligibility:'',deadline:'',description:''})
      show(`${form.company} — ${form.role} posted. All eligible students notified.`)
    } catch { show('Failed to post','error') }
    finally { setLoading(false) }
  }

  const typeStyle = {placement:'text-blue-400',internship:'text-amber-400',research:'text-purple-400'}

  return (
    <div>
      <PageHeader title="Post Placements & Internships" subtitle="Push opportunities to eligible students instantly" />
      <div className="flex flex-col md:flex-row gap-3 px-5 py-4">
        <div className="w-full md:w-[420px] flex-shrink-0">
          <div className="bg-[#0f0f0f] border border-[#262626] rounded-sm p-4">
            <div className="font-mono text-[0.6rem] text-[#a3a3a3] uppercase tracking-[0.1em] mb-4">Post New Opportunity</div>
            <div className="grid grid-cols-2 gap-2">
              <FormInput label="Company *" value={form.company} onChange={e=>setForm(f=>({...f,company:e.target.value}))} placeholder="e.g. Infosys" />
              <FormInput label="Role *" value={form.role} onChange={e=>setForm(f=>({...f,role:e.target.value}))} placeholder="e.g. Systems Engineer" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <FormSelect label="Type" value={form.placement_type} onChange={e=>setForm(f=>({...f,placement_type:e.target.value}))} options={['internship','placement','research']} />
              <FormInput label="Compensation" value={form.compensation} onChange={e=>setForm(f=>({...f,compensation:e.target.value}))} placeholder="e.g. 3.6 LPA" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <FormInput label="Location" value={form.location} onChange={e=>setForm(f=>({...f,location:e.target.value}))} placeholder="e.g. Bengaluru / Remote" />
              <FormInput label="Deadline" type="date" value={form.deadline} onChange={e=>setForm(f=>({...f,deadline:e.target.value}))} />
            </div>
            <FormInput label="Eligibility" value={form.eligibility} onChange={e=>setForm(f=>({...f,eligibility:e.target.value}))} placeholder="e.g. BCA · 60%+ · No backlogs" />
            <FormTextarea label="Description" value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} placeholder="Brief description of the role and process..." />
            <BlueButton onClick={submit} disabled={loading}>{loading?'Posting...':'Post + Notify Eligible Students'}</BlueButton>
          </div>
        </div>
        <div className="flex-1">
          <div className="font-mono text-[0.58rem] text-[#525252] uppercase tracking-[0.12em] mb-3 flex items-center gap-2">Posted Opportunities<div className="flex-1 h-px bg-[#262626]"></div></div>
          {posted.map(p => (
            <div key={p.id} className="bg-[#0f0f0f] border border-[#262626] rounded-sm p-4 mb-2">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className={`font-mono text-[0.58rem] uppercase ${typeStyle[p.placement_type]}`}>{p.placement_type}</span>
                <span className="font-mono text-[0.6rem] text-[#525252]">Deadline: {p.deadline}</span>
              </div>
              <div className="font-display font-bold text-[0.9rem] text-white">{p.company}</div>
              <div className="text-[0.76rem] text-[#a3a3a3] mb-1">{p.role}</div>
              <div className="font-mono text-[0.62rem] text-green-400">{p.enrolled_count} students enrolled</div>
            </div>
          ))}
        </div>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={hide} />}
    </div>
  )
}
