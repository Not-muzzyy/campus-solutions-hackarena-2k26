import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [role, setRole] = useState('student')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!email || !password) { setError('Please enter your credentials.'); return }
    setLoading(true); setError('')
    try {
      const user = await login(email, password, role)
      navigate(user.role === 'faculty' ? '/faculty' : '/student')
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed. Check your credentials.')
    } finally { setLoading(false) }
  }

  const fillDemo = () => {
    setEmail(role === 'student' ? 'student@nims.edu' : 'faculty@nims.edu')
    setPassword(role === 'student' ? 'student123' : 'faculty123')
  }

  return (
    <div className="min-h-screen bg-[#080808] flex flex-col items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-red-700 via-amber-500 to-red-700" />
      <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-red-900/5 blur-3xl pointer-events-none" />

      <div className="text-center mb-8">
        <h1 className="font-['Syne'] font-black text-[2.5rem] text-[#F59E0B] tracking-tight leading-none">
          Campus<span className="text-[#B91C1C]">IQ</span>
        </h1>
        <p className="text-[0.78rem] text-[#525252] mt-1">AI-Powered Smart Campus Assistant · HackArena 2K26</p>
      </div>

      <div className="w-full max-w-[400px]">
        {/* Role selector */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {['student', 'faculty'].map(r => (
            <button key={r} onClick={() => setRole(r)}
              className={`py-3 rounded-sm border text-center transition-all ${role === r ? 'bg-red-950/25 border-red-800/40 text-white' : 'bg-[#0f0f0f] border-[#1e1e1e] text-[#525252] hover:border-[#2a2a2a]'}`}>
              <div className="font-['Syne'] font-bold text-[0.88rem]">{r === 'student' ? 'Student' : 'Faculty'}</div>
              <div className="text-[0.68rem] mt-0.5 text-[#525252]">{r === 'student' ? 'Access your campus' : 'Manage your class'}</div>
            </button>
          ))}
        </div>

        <form onSubmit={handleLogin} className="bg-[#0f0f0f] border border-[#1e1e1e] rounded-sm p-5">
          <h3 className="font-['Syne'] font-bold text-[0.95rem] text-white mb-4">{role === 'student' ? 'Student' : 'Faculty'} Login</h3>
          <div className="mb-3">
            <label className="block font-['DM_Mono'] text-[0.58rem] text-[#525252] uppercase tracking-wide mb-1.5">Email</label>
            <input type="text" value={email} onChange={e => setEmail(e.target.value)} placeholder={role === 'student' ? 'student@nims.edu' : 'faculty@nims.edu'}
              className="w-full bg-[#161616] border border-[#1e1e1e] text-white text-[0.83rem] px-3 py-2.5 rounded-sm outline-none focus:border-red-800/60 placeholder-[#525252]" />
          </div>
          <div className="mb-4">
            <label className="block font-['DM_Mono'] text-[0.58rem] text-[#525252] uppercase tracking-wide mb-1.5">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password"
              className="w-full bg-[#161616] border border-[#1e1e1e] text-white text-[0.83rem] px-3 py-2.5 rounded-sm outline-none focus:border-red-800/60 placeholder-[#525252]" />
          </div>
          {error && <div className="bg-red-950/20 border border-red-900/30 text-red-300 text-[0.75rem] px-3 py-2 rounded-sm mb-3">{error}</div>}
          <button type="submit" disabled={loading}
            className="w-full bg-red-700 hover:bg-red-600 disabled:bg-[#262626] text-white font-semibold text-[0.85rem] py-2.5 rounded-sm transition-colors">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-3 bg-[#0f0f0f] border border-[#1e1e1e] border-l-2 border-l-amber-600 rounded-sm px-4 py-3">
          <div className="font-['DM_Mono'] text-[0.58rem] text-amber-600 uppercase tracking-wide mb-1.5">Demo Credentials</div>
          <div className="font-['DM_Mono'] text-[0.68rem] text-[#a3a3a3] mb-2">
            {role === 'student' ? (<><div>Email: <span className="text-white">student@nims.edu</span></div><div>Password: <span className="text-white">student123</span></div></>) : (<><div>Email: <span className="text-white">faculty@nims.edu</span></div><div>Password: <span className="text-white">faculty123</span></div></>)}
          </div>
          <button onClick={fillDemo} className="text-[0.68rem] text-amber-500 hover:text-amber-400 font-['DM_Mono'] transition-colors">Click to auto-fill →</button>
        </div>
      </div>

      <div className="absolute bottom-4 text-[0.68rem] text-[#525252]">Built by <span className="text-[#a3a3a3]">Team Codex</span> · NIMS Bellary · HackArena 2K26</div>
    </div>
  )
}
