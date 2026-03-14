import { useAuth } from '../context/AuthContext'
import StudentQuestions from './Student/StudentQuestions'
import InstructorQuestions from './Instructor/InstructorQuestions'

const STUDENT_EMAIL = import.meta.env.VITE_STUDENT_EMAIL as string

export default function Questions() {
  const { user } = useAuth()
  return user?.email === STUDENT_EMAIL ? <StudentQuestions /> : <InstructorQuestions />
}
