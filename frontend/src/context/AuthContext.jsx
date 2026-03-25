import { createContext, useContext, useState, useEffect } from 'react'
import api from '../api/axios'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('ciq_user')
    const token = localStorage.getItem('ciq_token')
    if (stored && token) setUser(JSON.parse(stored))
    setLoading(false)
  }, [])

  const login = async (email, password, role) => {
    const res = await api.post('/auth/login', { email, password, role })
    const { access_token, user: u } = res.data
    setUser(u)
    localStorage.setItem('ciq_user', JSON.stringify(u))
    localStorage.setItem('ciq_token', access_token)
    return u
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('ciq_user')
    localStorage.removeItem('ciq_token')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
