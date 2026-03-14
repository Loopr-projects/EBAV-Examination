import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import DashboardHeader from '../components/DashboardHeader'
import {
  BookOpenIcon,
  DocumentTextIcon,
  ClockIcon,
} from '@heroicons/react/24/outline'

const STUDENT_EMAIL = import.meta.env.VITE_STUDENT_EMAIL as string

const NAV_CARDS = [
  {
    to: '/questions',
    icon: BookOpenIcon,
    title: 'Questions',
    description: 'Browse question categories and review answers.',
  },
  {
    to: '/documents',
    icon: DocumentTextIcon,
    title: 'Documents',
    description: 'Access study materials and reference documents.',
  },
  {
    to: '/history',
    icon: ClockIcon,
    title: 'History',
    description: 'Review your past exam results and progress.',
  },
]

export default function Dashboard() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const role = user?.email === STUDENT_EMAIL ? 'Student' : 'Instructor'

  return (
    <div className="dashboard-container">
      <DashboardHeader email={user?.email ?? ''} onSignOut={signOut} />

      <main className="dashboard-main">
        <div className="landing-welcome">
          <h1 className="landing-title">Welcome back, <span>{role}</span></h1>
          <p className="landing-subtitle">What would you like to do today?</p>
        </div>

        <div className="landing-grid">
          {NAV_CARDS.map(({ to, icon: Icon, title, description }) => (
            <button key={to} className="landing-card" onClick={() => navigate(to)}>
              <div className="landing-card-icon">
                <Icon width={28} height={28} />
              </div>
              <div className="landing-card-body">
                <h2 className="landing-card-title">{title}</h2>
                <p className="landing-card-desc">{description}</p>
              </div>
            </button>
          ))}
        </div>
      </main>
    </div>
  )
}
