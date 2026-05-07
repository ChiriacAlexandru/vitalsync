import { Navigate, Route, Routes } from 'react-router-dom'
import DashboardLayout from './layouts/dashboard/DashboardLayout'
import LoginPage from './pages/auth/LoginPage'
import AlarmePage from './pages/shared/AlarmePage'
import ChartsPage from './pages/shared/ChartsPage'
import DashboardPage from './pages/shared/DashboardPage'
import MediciPage from './pages/shared/MediciPage'
import PacientiPage from './pages/shared/PacientiPage'
import PatientDetailsPage from './pages/shared/PatientDetailsPage'
import ProfilPage from './pages/shared/ProfilPage'

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<DashboardLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/medici" element={<MediciPage />} />
        <Route path="/pacienti" element={<PacientiPage />} />
        <Route path="/pacienti/:patientId" element={<PatientDetailsPage />} />
        <Route path="/grafice" element={<ChartsPage />} />
        <Route path="/alarme" element={<AlarmePage />} />
        <Route path="/profil" element={<ProfilPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default App
