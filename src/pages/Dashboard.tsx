import { useAuth } from '../context/AuthContext'
import StudentDashboard from './Student/StudentDashboard'
import InstructorDashboard from './Instructor/InstructorDashboard'

const STUDENT_EMAIL = import.meta.env.VITE_STUDENT_EMAIL as string

export default function Dashboard() {
  const { user } = useAuth()
  return user?.email === STUDENT_EMAIL ? <StudentDashboard /> : <InstructorDashboard />
}
