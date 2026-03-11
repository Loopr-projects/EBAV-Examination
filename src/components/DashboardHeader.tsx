import { NavLink } from 'react-router-dom'
import ebavLogo from '../assets/EBAV-Correct.png'

interface DashboardHeaderProps {
  email: string
  onSignOut: () => void
}

export default function DashboardHeader({ email, onSignOut }: DashboardHeaderProps) {
  const role = email === 'test@test.com' ? 'Instructor' : 'Student'

  return (
    <header className="dashboard-header">
      <div className="dashboard-header-brand">
        <img src={ebavLogo} alt="EBAV logo" className="dashboard-header-logo" />
        <span className="dashboard-header-title">Avernas Flight School</span>
      </div>
      <nav className="dashboard-nav">
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Dashboard</NavLink>
        <NavLink to="/documents" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Documents</NavLink>
        <NavLink to="/history" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>History</NavLink>
      </nav>
      <div className="dashboard-header-user">
        <span className="dashboard-header-role">{role}</span>
        <span className="dashboard-header-email">{email}</span>
        <button onClick={onSignOut} className="btn-secondary">Sign Out</button>
      </div>
    </header>
  )
}
