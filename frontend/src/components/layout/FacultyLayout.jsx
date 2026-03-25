import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const GROUPS = [
  { label: 'Overview', items: [{ to: '/faculty', label: 'Dashboard' }]},
  { label: 'Communication', items: [
    { to: '/faculty/announce',   label: 'Post Announcement' },
    { to: '/faculty/receipts',   label: 'Read Receipts' },
  ]},
  { label: 'Students', items: [
    { to: '/faculty/leave',      label: 'Leave Approvals', badge: true },
    { to: '/faculty/attendance', label: 'Mark Attendance' },
    { to: '/faculty/marks',      label: 'Enter Marks' },
  ]},
  { label: 'Campus', items: [
    { to: '/faculty/placements', label: 'Post Placements' },
    { to: '/faculty/canteen',    label: 'Canteen' },
    { to: '/faculty/grievances', label: 'Grievances' },
  ]},
]

const MOB = [
  { to: '/faculty',            label: 'Home' },
  { to: '/faculty/announce',   label: 'Announce' },
  { to: '/faculty/leave',      label: 'Leave', badge: true },
  { to: '/faculty/attendance', label: 'Attend' },
  { to: '/faculty/marks',      label: 'Marks' },
  { to: '/faculty/placements', label: 'Jobs' },
  { to: '/faculty/canteen',    label: 'Canteen' },
]

export default function FacultyLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  return (
    <div className="flex flex-col h-screen bg-[#080808]">
      <header className="h-[50px] flex-shrink-0 bg-[#0f0f0f] border-b border-[#1e1e1e] flex items-center justify-between px-5 z-50">
        <div className="flex items-center gap-2">
          <span className="font-['Syne'] font-black text-[1.15rem] text-[#F59E0B]">Campus<span className="text-[#B91C1C]">IQ</span></span>
          <span className="font-['DM_Mono'] text-[0.6rem] text-[#525252]">Faculty</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden sm:flex items-center gap-1.5 bg-blue-950/20 border border-blue-900/25 text-blue-300 text-[0.7rem] px-2.5 py-1 rounded-sm">{user?.name?.split(' ').slice(0,2).join(' ')}</span>
          <button onClick={() => { logout(); navigate('/login') }} className="text-[#525252] border border-[#1e1e1e] bg-[#161616] text-[0.7rem] px-2.5 py-1 rounded-sm hover:text-red-400 transition-colors">Sign Out</button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <nav className="hidden md:flex w-[210px] flex-col flex-shrink-0 bg-[#0f0f0f] border-r border-[#1e1e1e] overflow-y-auto py-2">
          {GROUPS.map(g => (
            <div key={g.label} className="px-2.5 py-1">
              <div className="font-['DM_Mono'] text-[0.52rem] text-[#525252] uppercase tracking-[0.15em] px-2 mb-1">{g.label}</div>
              {g.items.map(item => (
                <NavLink key={item.to} to={item.to} end={item.to === '/faculty'}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-[0.45rem] text-[0.78rem] rounded-sm mb-px border transition-all ${
                      isActive ? 'bg-blue-950/20 text-white border-blue-900/25' : 'text-[#525252] border-transparent hover:bg-[#161616] hover:text-[#e5e5e5]'
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

      <nav className="flex md:hidden bg-[#0f0f0f] border-t border-[#1e1e1e] flex-shrink-0">
        {MOB.map(item => (
          <NavLink key={item.to} to={item.to} end={item.to === '/faculty'}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center py-2 text-[0.46rem] font-['DM_Mono'] uppercase tracking-wide relative transition-colors ${isActive ? 'text-blue-400' : 'text-[#525252]'}`}>
            <span className="w-4 h-px bg-current mb-1 block" />
            {item.label}
            {item.badge && <span className="absolute top-1 right-[calc(50%-15px)] bg-red-700 text-white text-[0.44rem] w-3 h-3 rounded-full flex items-center justify-center">3</span>}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
