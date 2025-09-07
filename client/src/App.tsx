import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../src/hooks/ProtectedRoute';
import DashboardPage from '../src/components/DashBoardPage';
import LandingPage from './components/LandingPage';
import { AuthProvider } from '../src/contexts/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage/>} />
          
          {/* Protected routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardPage/>
              </ProtectedRoute>
            } 
          />
        
        </Routes>
      </Router>
    </AuthProvider>
  );
}
