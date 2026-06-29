import { Routes, Route } from 'react-router-dom'
import AuthPage from './auth/AuthPage'

// твои остальные импорты для главного приложения
import MainApp from './MainApp'

function App() {

  return (
    <Routes>
      <Route path="/login" element={<AuthPage />} />
      <Route path="/" element={<MainApp />} />
    </Routes>
  )
}

export default App