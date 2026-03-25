// Announcements.jsx
import { useState, useEffect } from 'react'
import { PageHeader, useToast, Toast } from '../../components/ui/index'
import api from '../../api/axios'

export function Announcements() {
  const [items, setItems] = useState([])
  const { toast, show, hide } = useToast()

  useEffect(() => { api.get('/announcements').then(r => setItems(r.data)).catch(() => {}) }, [])

  const markRead = async (id) => {
    await api.post('/announcements/read', { announcement_id: id }).catch(() => {})
    setItems(prev => prev.map(a => a.id === id ? { ...a, is_read: true } : a))
    show('Marked as read')
  }

  const colors = { Exam: '#ef4444', Event: '#f97316', Fee: '#eab308', General: '#3b82f6', Placement: '#22c55e' }

  return (
    <div>
      <PageHeader title="Announcements" subtitle="All college notices — click to mark as read" />
      <div className="px-5 py-4 flex flex-col gap-3">
        {items.map(ann => (
          <div key={ann.id} onClick={() => !ann.is_read && markRead(ann.id)}
            className={`bg-[#0f0f0f] border border-[#262626] rounded-sm p-4 flex gap-3 cursor-pointer transition-colors hover:border-[#3a3a3a] ${!ann.is_read ? 'border-l-2 border-l-red-700' : ''}`}>
            <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: colors[ann.category] || '#3b82f6' }}></div>
            <div className="flex-1">
              <div className="text-[0.88rem] text-white font-medium mb-1 flex items-center gap-2 flex-wrap">
                {ann.title}
                {!ann.is_read && <span className="bg-red-700 text-white font-mono text-[0.52rem] px-1.5 py-px rounded-sm">NEW</span>}
                <span className={`font-mono text-[0.52rem] px-1.5 py-px rounded-sm ${ann.is_read ? 'bg-green-950/20 text-green-500 border border-green-900/20' : 'bg-red-950/20 text-red-400 border border-red-900/20'}`}>
                  {ann.is_read ? 'Read' : 'Unread'}
                </span>
              </div>
              <div className="text-[0.77rem] text-[#a3a3a3] leading-relaxed mb-2">{ann.body}</div>
              <div className="flex gap-3 flex-wrap">
                <span className="font-mono text-[0.6rem] text-[#D97706]">{ann.department}</span>
                <span className="font-mono text-[0.6rem] text-[#525252]">{new Date(ann.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && <div className="text-[0.8rem] text-[#525252]">Loading announcements...</div>}
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={hide} />}
    </div>
  )
}
export default Announcements
