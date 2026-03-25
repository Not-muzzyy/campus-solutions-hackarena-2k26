// Library.jsx
import { useState, useEffect } from 'react'
import { PageHeader, useToast, Toast } from '../../components/ui/index'
import api from '../../api/axios'

export default function Library() {
  const [tab, setTab] = useState('available')
  const [books, setBooks] = useState([])
  const [borrowed, setBorrowed] = useState([])
  const { toast, show, hide } = useToast()

  useEffect(() => {
    api.get('/library/books').then(r => setBooks(r.data)).catch(() => {
      setBooks([
        {id:'1',title:'Database System Concepts',author:'Silberschatz',isbn:'978-0-07-802215-9',total_copies:3,available_copies:2},
        {id:'2',title:'Computer Networks',author:'Tanenbaum',isbn:'978-0-13-212695-3',total_copies:2,available_copies:1},
        {id:'3',title:'Introduction to ML',author:'Alpaydin',isbn:'978-0-26-207466-3',total_copies:2,available_copies:2},
        {id:'4',title:'Software Engineering',author:'Sommerville',isbn:'978-0-13-703515-1',total_copies:3,available_copies:3},
        {id:'5',title:'Python Programming',author:'John Zelle',isbn:'978-1-59028-241-0',total_copies:4,available_copies:3},
        {id:'6',title:'Operating Systems',author:'Silberschatz',isbn:'978-0-47-069466-3',total_copies:2,available_copies:0},
      ])
    })
    api.get('/library/my-borrows').then(r => setBorrowed(r.data)).catch(() => {
      setBorrowed([
        {id:'b1',book_title:'Database System Concepts',author:'Silberschatz',borrowed_date:'20 Feb 2026',due_date:'20 Mar 2026',days_remaining:7,status:'ok'},
        {id:'b2',book_title:'Computer Networks',author:'Tanenbaum',borrowed_date:'5 Mar 2026',due_date:'5 Apr 2026',days_remaining:23,status:'ok'},
      ])
    })
  }, [])

  const borrow = async (book) => {
    try {
      await api.post('/library/borrow', { book_id: book.id })
      show(`${book.title} borrowed. Due in 30 days.`)
      setBooks(prev => prev.map(b => b.id === book.id ? {...b, available_copies: b.available_copies - 1} : b))
    } catch (e) {
      show(e.response?.data?.detail || 'Failed to borrow', 'error')
    }
  }

  const returnBook = async (borrow) => {
    try {
      await api.post('/library/return', { borrow_id: borrow.id })
      show(`${borrow.book_title} returned.`)
      setBorrowed(prev => prev.filter(b => b.id !== borrow.id))
    } catch {
      show('Failed to return', 'error')
    }
  }

  const dueColor = s => s==='overdue'?'#ef4444':s==='warning'?'#f97316':'#22c55e'

  return (
    <div>
      <PageHeader title="Library" subtitle="Your pass, available books, and borrowing records" />
      <div className="px-5 py-4">
        {/* Pass */}
        <div className="bg-[#0f0f0f] border border-red-900/25 rounded-sm p-4 mb-4 flex items-center justify-between flex-wrap gap-3">
          <div>
            <div className="font-mono text-[0.62rem] text-[#525252]">NIMS-LIB-2024-BCA6-047</div>
            <div className="text-[0.88rem] text-white font-medium mt-0.5">BCA VI Sem, Section A</div>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-[0.68rem] text-[#a3a3a3]">Borrowed: {borrowed.length} / 3</span>
            <span className="font-mono text-[0.6rem] bg-green-950/15 text-green-400 border border-green-900/20 px-2 py-0.5 rounded-sm">Active · Valid till Apr 2026</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
          {[{n:'248',l:'Total Books',c:'#F59E0B'},{n:'187',l:'Available',c:'#22c55e'},{n:'61',l:'Borrowed',c:'#f97316'},{n:borrowed.length,l:'My Borrowed',c:'#3b82f6'}].map(s=>(
            <div key={s.l} className="bg-[#0f0f0f] border border-[#262626] rounded-sm p-3 text-center">
              <div className="font-display font-black text-[1.4rem]" style={{color:s.c}}>{s.n}</div>
              <div className="font-mono text-[0.57rem] text-[#525252] uppercase mt-0.5">{s.l}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-3">
          {['available','myborrowed'].map(t=>(
            <button key={t} onClick={()=>setTab(t)} className={`text-[0.7rem] px-3 py-1.5 rounded-sm border transition-all ${tab===t?'bg-red-950/25 border-red-900/35 text-white':'bg-[#161616] border-[#262626] text-[#525252]'}`}>
              {t==='available'?'Available Books':'My Borrowed Books'}
            </button>
          ))}
        </div>

        {tab === 'available' ? (
          <div className="bg-[#0f0f0f] border border-[#262626] rounded-sm overflow-hidden">
            <div className="grid grid-cols-4 border-b border-[#262626]">
              {['Title','Copies','Available','Action'].map(h=>(
                <div key={h} className="font-mono text-[0.57rem] text-[#525252] uppercase tracking-wide px-3 py-2.5">{h}</div>
              ))}
            </div>
            {books.map(b=>(
              <div key={b.id} className="grid grid-cols-4 hover:bg-[#161616] border-b border-[#1e1e1e] last:border-0">
                <div className="px-3 py-2.5">
                  <div className="text-[0.78rem] text-[#e5e5e5] font-medium">{b.title}</div>
                  <div className="text-[0.65rem] text-[#525252]">{b.author}</div>
                </div>
                <div className="px-3 py-2.5 font-mono text-[0.78rem] text-[#e5e5e5] flex items-center">{b.total_copies}</div>
                <div className="px-3 py-2.5 flex items-center">
                  <span className={`font-mono text-[0.62rem] px-2 py-0.5 rounded-sm ${b.available_copies>0?'bg-green-950/15 text-green-400 border border-green-900/20':'bg-red-950/15 text-red-400 border border-red-900/20'}`}>
                    {b.available_copies > 0 ? `${b.available_copies} avail` : 'Not avail'}
                  </span>
                </div>
                <div className="px-3 py-2.5 flex items-center">
                  <button onClick={()=>borrow(b)} disabled={b.available_copies===0}
                    className="bg-red-700 hover:bg-red-600 disabled:bg-[#262626] disabled:text-[#525252] text-white text-[0.65rem] px-2.5 py-1 rounded-sm transition-colors">
                    {b.available_copies > 0 ? 'Borrow' : 'Unavailable'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {borrowed.length === 0 ? (
              <div className="text-[0.8rem] text-[#525252] py-4">No books currently borrowed.</div>
            ) : borrowed.map(b=>(
              <div key={b.id} className="bg-[#0f0f0f] border border-[#262626] rounded-sm p-4 flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <div className="text-[0.85rem] text-white font-medium">{b.book_title}</div>
                  <div className="font-mono text-[0.62rem] text-[#525252] mt-0.5">Borrowed: {b.borrowed_date} · Due: {b.due_date}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[0.65rem]" style={{color:dueColor(b.status)}}>
                    {b.days_remaining > 0 ? `${b.days_remaining} days left` : 'Overdue'}
                  </span>
                  <button onClick={()=>returnBook(b)} className="bg-[#161616] border border-[#262626] text-[#a3a3a3] text-[0.7rem] px-3 py-1.5 rounded-sm hover:text-white transition-colors">Return</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={hide} />}
    </div>
  )
}
