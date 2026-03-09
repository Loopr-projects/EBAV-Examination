# EBAV Examination

A simple webapp for EBAV Flight School built with the latest **React 19** and **Vite 7**, implementing the full **Supabase authentication flow**.

## Features

- ✅ Email / password **sign-up** with confirmation email
- ✅ Email / password **sign-in**
- ✅ **Sign-out**
- ✅ Session persistence across page reloads (Supabase handles this automatically)
- ✅ `onAuthStateChange` listener for real-time session updates
- ✅ Protected `/dashboard` route — unauthenticated users are redirected to `/login`

## Project Structure

```
src/
├── supabase/
│   └── client.js          # Supabase client initialisation
├── context/
│   └── AuthContext.jsx    # Auth state provider + useAuth hook
├── components/
│   └── ProtectedRoute.jsx # Route guard for authenticated users
├── pages/
│   ├── Login.jsx          # Sign-in page
│   ├── SignUp.jsx         # Sign-up page
│   └── Dashboard.jsx      # Protected dashboard
├── App.jsx                # Routing
├── main.jsx               # Entry point
└── index.css              # Global styles
```

## Getting Started

### 1. Prerequisites

- [Node.js](https://nodejs.org/) 18+
- A [Supabase](https://supabase.com/) project with **Email auth** enabled

### 2. Clone & install

```bash
git clone <repo-url>
cd EBAV-Examination
npm install
```

### 3. Configure environment variables

Copy `.env.example` to `.env` and fill in your Supabase credentials:

```bash
cp .env.example .env
```

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

Both values are found in your Supabase Dashboard under **Settings → API**.

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

### 5. Build for production

```bash
npm run build
npm run preview
```

## Tech Stack

| Tool | Version |
|------|---------|
| React | 19 |
| Vite | 7 |
| @supabase/supabase-js | 2 |
| react-router-dom | 7 |
