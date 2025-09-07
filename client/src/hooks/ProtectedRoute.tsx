// components/ProtectedRoute.jsx
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import SignInPage from '../components/SignInPage';
import type { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { currentUser, loading } = useAuth();

  // Show loading spinner while checking auth state
  if (loading) {
    return <LoadingSpinner />;
  }
  console.log(currentUser)
  // If not authenticated, show custom fallback or default sign-in page
  if (!currentUser) {
    return <SignInPage />;
  }

  // User is authenticated, render protected content
  return children;
};

export default ProtectedRoute;