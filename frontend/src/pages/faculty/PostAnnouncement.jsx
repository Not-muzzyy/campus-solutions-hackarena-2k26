// PostAnnouncement.jsx
import { useState } from 'react'
import { PageHeader, FormInput, FormSelect, FormTextarea, BlueButton, useToast, Toast } from '../../components/ui/index'
import api from '../../api/axios'

export default function PostAnnouncement() {
  const [form, setForm] = useState({ title:'', body:'', category:'General', target:'All Students', priority:'Normal' })
  const [posted, setPosted] = useState([
    {title:'HackArena 2K26 — Registration Open',date:'12 Mar 2026',target:'All Students',read:28,total:34},
    {title:'Internal Assessment Schedule',date:'13 Mar 2026',target:'CSE Department',read:31,total:34},
    {title:'Fee Payment Deadline Reminder',date:'11 Mar 2026',target:'All Students',read:25,total:34},
  ])
  const [loading, setLoading] = useState(false)
  const { toast, show, hide } = useToast()

  const submit = async () => {
    if (!form.title || !form.body) { show('Please fill title and message.','error'); return }
    setLoading(true)
    try {
      await api.post('/announcements', form)
      setPosted(prev => [{title:form.title, date:'Just now', target:form.target, read:0, total:34}, ...prev])
      setForm(f => ({...f, title:'', body:''}))
      show('Announcement posted. Push notification sent to ' + form.target + '.')
    } catch { show('Failed to post','error') }
    finally { setLoading(false) }
  }

  return (
    <div>
      <PageHeader title="Post Announcement" subtitle="Broadcast to students — with read receipt tracking" />
      <div className="flex flex-col md:flex-row gap-3 px-5 py-4">
        <div className="w-full md:w-[400px] flex-shrink-0">
          <div className="bg-[#0f0f0f] border border-[#262626] rounded-sm p-4">
            <div className="font-mono text-[0.6rem] text-[#a3a3a3] uppercase tracking-[0.1em] mb-4">Create Announcement</div>
            <FormInput label="Title *" value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} placeholder="Announcement title..." />
            <div className="grid grid-cols-2 gap-2">
              <FormSelect label="Category" value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))} options={['General','Exam','Event','Fee','Placement','Holiday']} />
              <FormSelect label="Priority" value={form.priority} onChange={e=>setForm(f=>({...f,priority:e.target.value}))} options={['Normal','Important','Urgent']} />
            </div>
            <FormTextarea label="Message *" value={form.body} onChange={e=>setForm(f=>({...f,body:e.target.value}))} placeholder="Write your announcement..." />
            <FormSelect label="Target Audience" value={form.target} onChange={e=>setForm(f=>({...f,target:e.target.value}))} options={['All Students','CSE Department','BCA 6th Sem','Final Year Only']} />
            <BlueButton onClick={submit} disabled={loading}>{loading?'Posting...':'Post + Notify All Students'}</BlueButton>
          </div>
        </div>
        <div className="flex-1">
          <div className="font-mono text-[0.58rem] text-[#525252] uppercase tracking-[0.12em] mb-3 flex items-center gap-2">Recent Announcements<div className="flex-1 h-px bg-[#262626]"></div></div>
          {posted.map((p,i) => (
            <div key={i} className="bg-[#0f0f0f] border border-[#262626] rounded-sm p-4 mb-2 border-l-2 border-l-blue-700">
              <div className="text-[0.85rem] text-white font-medium mb-1">{p.title}</div>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="font-mono text-[0.6rem] text-[#525252]">{p.date} · {p.target}</span>
                <span className={`font-mono text-[0.62rem] px-2 py-0.5 rounded-sm ${p.read/p.total >= 0.8?'text-green-400 bg-green-950/15':'text-amber-400 bg-amber-950/15'}`}>
                  {p.read}/{p.total} read ({Math.round(p.read/p.total*100)}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={hide} />}
    </div>
  )
}
