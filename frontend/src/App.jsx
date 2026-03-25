import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'

import Login           from './pages/Login'
import StudentLayout   from './components/layout/StudentLayout'
import FacultyLayout   from './components/layout/FacultyLayout'

// Student pages
import SDashboard    from './pages/student/Dashboard'
import SAI           from './pages/student/AIAssistant'
import SAnnounce     from './pages/student/Announcements'
import SExams        from './pages/student/ExamTracker'
import SAttendance   from './pages/student/Attendance'
import SMarks        from './pages/student/Marks'
import SResults      from './pages/student/Results'
import SPapers       from './pages/student/PastPapers'
import SEvents       from './pages/student/Events'
import SCanteen      from './pages/student/Canteen'
import SLibrary      from './pages/student/Library'
import SPlacements   from './pages/student/Placements'
import SLeave        from './pages/student/Leave'
import SGrievance    from './pages/student/Grievance'
import SLostFound    from './pages/student/LostFound'

// Faculty pages
import FDashboard    from './pages/faculty/Dashboard'
import FAnnounce     from './pages/faculty/PostAnnouncement'
import FReceipts     from './pages/faculty/ReadReceipts'
import FLeave        from './pages/faculty/LeaveApprovals'
import FAttendance   from './pages/faculty/MarkAttendance'
import FMarks        from './pages/faculty/EnterMarks'
import FPlacements   from './pages/faculty/PostPlacements'
import FCanteen      from './pages/faculty/Canteen'
import FGrievances   from './pages/faculty/Grievances'

function Guard({ role, children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="h-screen bg-[#080808] flex items-center justify-center text-white/40 text-sm font-mono">Loading...</div>
  if (!user) return <Navigate to="/login" replace />
  if (role && user.role !== role) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Student */}
          <Route path="/student" element={<Guard role="student"><StudentLayout /></Guard>}>
            <Route index              element={<SDashboard />} />
            <Route path="ai"          element={<SAI />} />
            <Route path="announcements" element={<SAnnounce />} />
            <Route path="exams"       element={<SExams />} />
            <Route path="attendance"  element={<SAttendance />} />
            <Route path="marks"       element={<SMarks />} />
            <Route path="results"     element={<SResults />} />
            <Route path="papers"      element={<SPapers />} />
            <Route path="events"      element={<SEvents />} />
            <Route path="canteen"     element={<SCanteen />} />
            <Route path="library"     element={<SLibrary />} />
            <Route path="placements"  element={<SPlacements />} />
            <Route path="leave"       element={<SLeave />} />
            <Route path="grievance"   element={<SGrievance />} />
            <Route path="lostfound"   element={<SLostFound />} />
          </Route>

          {/* Faculty */}
          <Route path="/faculty" element={<Guard role="faculty"><FacultyLayout /></Guard>}>
            <Route index              element={<FDashboard />} />
            <Route path="announce"    element={<FAnnounce />} />
            <Route path="receipts"    element={<FReceipts />} />
            <Route path="leave"       element={<FLeave />} />
            <Route path="attendance"  element={<FAttendance />} />
            <Route path="marks"       element={<FMarks />} />
            <Route path="placements"  element={<FPlacements />} />
            <Route path="canteen"     element={<FCanteen />} />
            <Route path="grievances"  element={<FGrievances />} />
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
