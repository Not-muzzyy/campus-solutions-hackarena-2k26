import { useState, useEffect } from 'react'
import { PageHeader, useToast, Toast } from '../../components/ui/index'
import api from '../../api/axios'

export default function Placements() {
  const [placements, setPlacements] = useState([])
  const [filter, setFilter] = useState('all')
  const { toast, show, hide } = useToast()

  useEffect(() => {
    api.get('/placements').then(r => setPlacements(r.data)).catch(() => {
      setPlacements([
        {id:'1',company:'Infosys',role:'Systems Engineer',placement_type:'placement',compensation:'3.6 LPA',location:'Bengaluru',eligibility:'BCA · 60%+',deadline:'25 Mar 2026',description:'3 rounds: Online Test, Technical, HR.',required_skills:['Java','DSA','SQL'],posted_by:'Prof. Anand Kumar',enrolled_count:8,is_enrolled:false},
        {id:'2',company:'TCS iON',role:'Digital Intern',placement_type:'internship',compensation:'Rs.10,000/mo',location:'Remote',eligibility:'Any branch · 55%+',deadline:'20 Mar 2026',description:'6-month remote internship. PPO opportunity.',required_skills:['Python','Excel'],posted_by:'Prof. Suma Patil',enrolled_count:12,is_enrolled:false},
        {id:'3',company:'Wipro WILP',role:'ML Intern',placement_type:'internship',compensation:'Rs.15,000/mo',location:'Bengaluru',eligibility:'BCA · ML knowledge',deadline:'30 Mar 2026',description:'ML internship. NLP and vision projects.',required_skills:['Python','ML','Pandas'],posted_by:'Prof. Ravi Nair',enrolled_count:5,is_enrolled:false},
        {id:'4',company:'Capgemini',role:'Analyst',placement_type:'placement',compensation:'4.0 LPA',location:'Pune / Chennai',eligibility:'BCA · No backlogs',deadline:'5 Apr 2026',description:'4 rounds: Aptitude, Pseudocode, Technical, HR.',required_skills:['Aptitude','C'],posted_by:'Prof. Anand Kumar',enrolled_count:15,is_enrolled:false},
        {id:'5',company:'NIMS Research Cell',role:'AI Researcher',placement_type:'research',compensation:'Rs.3,000/mo stipend',location:'On-Campus',eligibility:'BCA · AI interest',deadline:'18 Mar 2026',description:'6-month on-campus AI research.',required_skills:['Python','Research'],posted_by:'Prof. Deepa Rao',enrolled_count:3,is_enrolled:false},
        {id:'6',company:'Zoho Corp',role:'Frontend Dev Intern',placement_type:'internship',compensation:'Rs.12,000/mo',location:'Chennai',eligibility:'BCA · Web dev portfolio',deadline:'1 Apr 2026',description:'Work on real Zoho products.',required_skills:['HTML','CSS','JS'],posted_by:'Prof. Suma Patil',enrolled_count:9,is_enrolled:false},
      ])
    })
  }, [])

  const enroll = async (id) => {
    try {
      await api.post('/placements/enroll', { placement_id: id })
      setPlacements(prev => prev.map(p => p.id === id ? {...p, is_enrolled: true, enrolled_count: p.enrolled_count + 1} : p))
      const p = placements.find(x => x.id === id)
      show(`Enrolled in ${p?.company} — ${p?.role}. Faculty notified.`)
    } catch { show('Enrollment failed', 'error') }
  }

  const typeStyle = {placement:'bg-blue-950/20 text-blue-400 border border-blue-900/25',internship:'bg-amber-950/20 text-amber-400 border border-amber-900/25',research:'bg-purple-950/20 text-purple-400 border border-purple-900/25'}
  const filtered = filter === 'all' ? placements : placements.filter(p => p.placement_type === filter)

  return (
    <div>
      <PageHeader title="Placements & Internships" subtitle="Opportunities posted by faculty — enroll with one click" />
      <div className="px-5 py-4">
        <div className="flex gap-2 mb-4 flex-wrap">
          {['all','placement','internship','research'].map(f=>(
            <button key={f} onClick={()=>setFilter(f)} className={`text-[0.7rem] px-3 py-1.5 rounded-sm border transition-all ${filter===f?'bg-red-950/25 border-red-900/35 text-white':'bg-[#161616] border-[#262626] text-[#525252]'}`}>
              {f==='all'?'All':f==='placement'?'Full-Time':f==='internship'?'Internships':'Research'}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {filtered.map(p => (
            <div key={p.id} className="bg-[#0f0f0f] border border-[#262626] rounded-sm p-4 hover:border-[#3a3a3a] transition-colors">
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className={`font-mono text-[0.57rem] px-2 py-0.5 rounded-sm ${typeStyle[p.placement_type]}`}>
                  {p.placement_type==='placement'?'Full-Time':p.placement_type==='internship'?'Internship':'Research'}
                </span>
                <span className="font-mono text-[0.6rem] text-[#525252]">Deadline: {p.deadline}</span>
              </div>
              <div className="font-display font-bold text-[0.95rem] text-white mb-0.5">{p.company}</div>
              <div className="text-[0.78rem] text-[#a3a3a3] mb-3">{p.role}</div>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {p.required_skills.map(s=>(
                  <span key={s} className="bg-[#161616] border border-[#262626] font-mono text-[0.58rem] px-2 py-0.5 text-[#525252] rounded-sm">{s}</span>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2 mb-3">
                {[{l:'Compensation',v:p.compensation},{l:'Location',v:p.location},{l:'Eligibility',v:p.eligibility},{l:'Posted by',v:p.posted_by}].map(i=>(
                  <div key={i.l}>
                    <div className="font-mono text-[0.58rem] text-[#525252] uppercase mb-0.5">{i.l}</div>
                    <div className="text-[0.72rem] text-[#a3a3a3]">{i.v}</div>
                  </div>
                ))}
              </div>
              <div className="text-[0.74rem] text-[#525252] mb-3">{p.description}</div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-[0.6rem] text-[#525252]">{p.enrolled_count} enrolled</span>
                <button onClick={()=>!p.is_enrolled && enroll(p.id)} disabled={p.is_enrolled}
                  className={`px-4 py-2 text-[0.75rem] font-semibold rounded-sm transition-colors ${p.is_enrolled?'bg-green-950/15 border border-green-900/25 text-green-400 cursor-default':'bg-red-700 hover:bg-red-600 text-white'}`}>
                  {p.is_enrolled ? 'Enrolled' : 'Register Interest'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={hide} />}
    </div>
  )
}
