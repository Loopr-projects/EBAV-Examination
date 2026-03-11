import { useAuth } from '../context/AuthContext'
import DashboardHeader from '../components/DashboardHeader'

export default function Documents() {
  const { user, signOut } = useAuth()
  return (
    <div className="dashboard-container">
      <DashboardHeader email={user?.email ?? ''} onSignOut={signOut} />
      <main className="dashboard-main">
        <h2>Documents</h2>
        <p>Coming soon.</p>
      </main>
    </div>
  )
}
