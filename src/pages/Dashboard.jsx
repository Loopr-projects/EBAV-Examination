import { useAuth } from '../context/AuthContext'

export default function Dashboard() {
  const { user, signOut } = useAuth()

  async function handleSignOut() {
    await signOut()
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>EBAV Flight School</h1>
        <button onClick={handleSignOut} className="btn-secondary">
          Sign Out
        </button>
      </header>

      <main className="dashboard-main">
        <div className="welcome-card">
          <h2>Welcome back!</h2>
          <p>
            Signed in as <strong>{user?.email}</strong>
          </p>
        </div>

        <div className="info-grid">
          <div className="info-card">
            <h3>Session Info</h3>
            <ul>
              <li>
                <span>User ID:</span>
                <code>{user?.id}</code>
              </li>
              <li>
                <span>Email:</span>
                <code>{user?.email}</code>
              </li>
              <li>
                <span>Email confirmed:</span>
                <code>{user?.email_confirmed_at ? 'Yes' : 'No'}</code>
              </li>
              <li>
                <span>Last sign in:</span>
                <code>
                  {user?.last_sign_in_at
                    ? new Date(user.last_sign_in_at).toLocaleString()
                    : '—'}
                </code>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}
