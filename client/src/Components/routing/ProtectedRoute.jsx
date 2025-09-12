// src/components/routing/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useSelector(state => state.auth);
  
  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="spinner-container">
        <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem' }}></i>
        <p>Loading...</p>
      </div>
    );
  }
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Render the protected component if authenticated
  return children;
};

export default ProtectedRoute;
