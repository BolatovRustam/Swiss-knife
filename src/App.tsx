import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './lib/supabase'
import { useAuthStore } from './store/authStore'


import AuthPage from './auth/AuthPage'
import MainApp from './MainApp'

function App() {
  const { session, loading, setSession, setLoading } = useAuthStore()

  useEffect(() => {
    supabase.auth.getSession().then(({data: {session} }) => {
      setSession(session)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [ setSession, setLoading ])

  if (loading) return null

  return (
    <Routes>
      <Route path="/login" element={!session ? <AuthPage /> : <Navigate to="/" />} />
      <Route path="/" element={session ? <MainApp /> : <Navigate to='/login' />} />
    </Routes>
  )
}

export default App