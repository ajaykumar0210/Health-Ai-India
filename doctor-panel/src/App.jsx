import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import DoctorLogin from './pages/Login/DoctorLogin'
import Layout from './components/Layout'
import AppointmentList from './pages/AppointmentList/AppointmentList'
import VideoConsult from './pages/VideoConsult/VideoConsult'
import WritePrescription from './pages/WritePrescription/WritePrescription'
import PatientHistory from './pages/PatientHistory/PatientHistory'
import { useAuth } from './store/useAuth'
import './App.css'

function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<DoctorLogin />} />
        <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
          <Route index element={<Navigate to="/appointments" replace />} />
          <Route path="appointments" element={<AppointmentList />} />
          <Route path="consult/:appointmentId" element={<VideoConsult />} />
          <Route path="prescription/:appointmentId" element={<WritePrescription />} />
          <Route path="patient/:patientId" element={<PatientHistory />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App