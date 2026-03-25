import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const GROUPS = [
  { label: 'Main', items: [
    { to: '/student',              label: 'Dashboard' },
    { to: '/student/ai',           label: 'AI Assistant' },
  ]},
  { label: 'Academic', items: [
    { to: '/student/announcements',label: 'Announcements', badge: true },
    { to: '/student/exams',        label: 'Exam Tracker' },
    { to: '/student/attendance',   label: 'Attendance' },
    { to: '/student/marks',        label: 'Internal Marks' },
    { to: '/student/results',      label: 'Results' },
    { to: '/student/papers',       label: 'Past Papers' },
  ]},
  { label: 'Campus', items: [
    { to: '/student/canteen',      label: 'Canteen' },
    { to: '/student/events',       label: 'Events' },
    { to: '/student/placements',   label: 'Placements' },
    { to: '/student/library',      label: 'Library' },
  ]},
  { label: 'Support', items: [
    { to: '/student/leave',        label: 'Leave' },
    { to: '/student/grievance',    label: 'Grievance' },
    { to: '/student/lostfound',    label: 'Lost & Found' },
  ]},
]

const MOB = [
  { to: '/student',               label: 'Home' },
  { to: '/student/ai',            label: 'AI' },
  { to: '/student/announcements', label: 'Notices', badge: true },
  { to: '/student/canteen',       label: 'Canteen' },
  { to: '/student/attendance',    label: 'Attend' },
  { to: '/student/placements',    label: 'Jobs' },
  { to: '/student/leave',         label: 'Leave' },
  { to: '/student/grievance',     label: 'Report' },
]

export default function StudentLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  return (
    <div className="flex flex-col h-screen bg-[#080808]">
      {/* Topbar */}
      <header className="h-[50px] flex-shrink-0 bg-[#0f0f0f] border-b border-[#1e1e1e] flex items-center justify-between px-5 z-50">
        <span className="font-['Syne'] font-black text-[1.15rem] text-[#F59E0B]">Campus<span className="text-[#B91C1C]">IQ</span></span>
        <div className="flex items-center gap-2">
          <span className="hidden sm:flex items-center gap-1.5 bg-[#161616] border border-[#1e1e1e] text-[#a3a3a3] text-[0.7rem] px-2.5 py-1 rounded-sm">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />{user?.name?.split(' ')[0]}
          </span>
          <button onClick={() => { logout(); navigate('/login') }} className="text-[#525252] border border-[#1e1e1e] bg-[#161616] text-[0.7rem] px-2.5 py-1 rounded-sm hover:text-red-400 transition-colors">Sign Out</button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar desktop */}
        <nav className="hidden md:flex w-[200px] flex-col flex-shrink-0 bg-[#0f0f0f] border-r border-[#1e1e1e] overflow-y-auto py-2">
          {GROUPS.map(g => (
            <div key={g.label} className="px-2.5 py-1">
              <div className="font-['DM_Mono'] text-[0.52rem] text-[#525252] uppercase tracking-[0.15em] px-2 mb-1">{g.label}</div>
              {g.items.map(item => (
                <NavLink key={item.to} to={item.to} end={item.to === '/student'}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-[0.45rem] text-[0.78rem] rounded-sm mb-px border transition-all ${
                      isActive ? 'bg-red-950/25 text-white border-red-900/30' : 'text-[#525252] border-transparent hover:bg-[#161616] hover:text-[#e5e5e5]'
                    }`}>
                  {item.label}
                  {item.badge && <span className="bg-red-700 text-white font-['DM_Mono'] text-[0.5rem] px-1 py-px rounded-sm">3</span>}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <main className="flex-1 overflow-y-auto"><Outlet /></main>
      </div>

      {/* Bottom nav mobile */}
      <nav className="flex md:hidden bg-[#0f0f0f] border-t border-[#1e1e1e] flex-shrink-0">
        {MOB.map(item => (
          <NavLink key={item.to} to={item.to} end={item.to === '/student'}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center py-2 text-[0.46rem] font-['DM_Mono'] uppercase tracking-wide relative transition-colors ${isActive ? 'text-red-400' : 'text-[#525252]'}`}>
            <span className="w-4 h-px bg-current mb-1 block" />
            {item.label}
            {item.badge && <span className="absolute top-1 right-[calc(50%-15px)] bg-red-700 text-white text-[0.44rem] w-3 h-3 rounded-full flex items-center justify-center">3</span>}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
