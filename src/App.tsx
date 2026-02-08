import { useEffect } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import { setAxiosNavigator } from './services/axios-config'
import ConfirmationPage from './pages/ConfirmationPage'

function App() {
  const navigate = useNavigate()

  useEffect(() => {
    setAxiosNavigator(navigate)
  }, [navigate])

  return (
    <Routes>
      <Route path="/" element={<LoginPage />}></Route>
      <Route path="/dashboard" element={<DashboardPage />}></Route>
      <Route path="/setup-account/:id/confirmation" element={<ConfirmationPage />}></Route>
      <Route path="*"></Route>
    </Routes>
  )
}

export default App
