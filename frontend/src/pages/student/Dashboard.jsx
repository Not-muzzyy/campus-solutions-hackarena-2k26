import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { StatCard, PageHeader, Card } from '../../components/ui/index'
import api from '../../api/axios'

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [announcements, setAnnouncements] = useState([])
  const [attendance, setAttendance] = useState([])

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening'

  useEffect(() => {
    api.get('/announcements').then(r => setAnnouncements(r.data.slice(0, 3))).catch(() => {})
    api.get('/attendance/my').then(r => setAttendance(r.data)).catch(() => {})
  }, [])

  const lowAttendance = attendance.filter(a => a.percentage < 80)

  const EXAMS = [
    { sub: 'Database Management Systems', days: 5, date: '18 Mar', room: 'Room 201' },
    { sub: 'Computer Networks', days: 8, date: '21 Mar', room: 'Room 203' },
    { sub: 'Machine Learning', days: 12, date: '25 Mar', room: 'Lab 3' },
  ]

  return (
    <div className="pb-4">
      <PageHeader
        title={`${greeting}, ${user?.name?.split(' ')[0]}`}
        subtitle="Your campus overview — NIMS, Ballari"
      />

      {/* Attendance Warning */}
      {lowAttendance.length > 0 && (
        <div className="mx-5 mt-4 bg-orange-950/20 border border-orange-900/30 border-l-2 border-l-orange-500 px-4 py-3 rounded-sm">
          <div className="text-orange-400 font-semibold text-[0.78rem] mb-0.5">Attendance Warning</div>
          <div className="text-[#a3a3a3] text-[0.73rem]">
            {lowAttendance.map(a => a.subject).join(', ')} — below 80%. Risk of exam debarment.
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 px-5 mt-4">
        <StatCard number={announcements.filter(a => !a.is_read).length || 3} label="New Notices" sub="Posted today" />
        <StatCard number="78%" label="Attendance" sub="Below 80% — warning" subColor="#f97316" />
        <StatCard number="5" label="Days to Exam" sub="DBMS — 18 Mar" />
        <StatCard number="2" label="Books Borrowed" sub="Due in 7 days" />
      </div>

      {/* Two column grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 px-5 mt-2.5">
        {/* Announcements */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="font-mono text-[0.6rem] text-[#D97706] uppercase tracking-[0.08em] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-blue-600 rounded-sm"></span>Latest Announcements
            </div>
            <button onClick={() => navigate('/student/announcements')} className="text-[0.65rem] text-red-500 font-mono hover:text-red-400">View all</button>
          </div>
          {announcements.length === 0 ? (
            <div className="text-[0.75rem] text-[#525252]">Loading...</div>
          ) : announcements.map(ann => (
            <div key={ann.id} className="py-2 border-b border-[#1e1e1e] last:border-0">
              <div className="text-[0.8rem] text-[#e5e5e5] mb-0.5 flex items-center gap-1.5 flex-wrap">
                {!ann.is_read && <span className="w-1.5 h-1.5 bg-red-600 rounded-full flex-shrink-0"></span>}
                <span className="bg-red-950/40 text-red-300 font-mono text-[0.55rem] px-1.5 py-px rounded-sm">{ann.category}</span>
                {ann.title}
              </div>
              <div className="text-[0.67rem] text-[#525252]">{ann.department} · {new Date(ann.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
            </div>
          ))}
        </Card>

        {/* Exam Tracker */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="font-mono text-[0.6rem] text-[#D97706] uppercase tracking-[0.08em] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-blue-600 rounded-sm"></span>Upcoming Exams
            </div>
            <button onClick={() => navigate('/student/exams')} className="text-[0.65rem] text-red-500 font-mono hover:text-red-400">View all</button>
          </div>
          {EXAMS.map(e => (
            <div key={e.sub} className="flex items-center gap-3 py-2 border-b border-[#1e1e1e] last:border-0">
              <div className="w-11 h-11 bg-red-950/20 border border-red-900/25 flex flex-col items-center justify-center flex-shrink-0 rounded-sm">
                <div className="font-display font-black text-[0.95rem] text-red-400 leading-none">{e.days}</div>
                <div className="font-mono text-[0.43rem] text-[#525252] uppercase">days</div>
              </div>
              <div>
                <div className="text-[0.78rem] text-[#e5e5e5] font-medium">{e.sub}</div>
                <div className="text-[0.65rem] text-[#525252]">{e.date} · {e.room}</div>
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  )
}
