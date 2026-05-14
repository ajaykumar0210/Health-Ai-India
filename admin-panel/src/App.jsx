import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AdminLogin from './pages/Login/AdminLogin'
import AdminLayout from './components/AdminLayout'
import Dashboard from './pages/Dashboard/Dashboard'
import UserManagement from './pages/UserManagement/UserManagement'
import DoctorManagement from './pages/DoctorManagement/DoctorManagement'
import RevenueReports from './pages/RevenueReports/RevenueReports'
import RefundManagement from './pages/RefundManagement/RefundManagement'
import { useAdminAuth } from './store/useAdminAuth'
import './App.css'

function PrivateRoute({ children }) {
  const { isAuthenticated } = useAdminAuth()
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<AdminLogin />} />
        <Route path="/" element={<PrivateRoute><AdminLayout /></PrivateRoute>}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="doctors" element={<DoctorManagement />} />
          <Route path="revenue" element={<RevenueReports />} />
          <Route path="refunds" element={<RefundManagement />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App