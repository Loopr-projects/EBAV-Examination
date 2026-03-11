import { useAuth } from '../context/AuthContext'
import DashboardHeader from '../components/DashboardHeader'

export default function History() {
  const { user, signOut } = useAuth()
  return (
    <div className="dashboard-container">
      <DashboardHeader email={user?.email ?? ''} onSignOut={signOut} />
      <main className="dashboard-main">
        <h2>History</h2>
        <p>Coming soon.</p>
      </main>
    </div>
  )
}
