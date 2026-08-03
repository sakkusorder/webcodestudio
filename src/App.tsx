import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { Layout } from './components/Layout';

// Pages
import { Home } from './pages/Home';
import { Auth } from './pages/Auth';
import { Dashboard } from './pages/Dashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { Templates } from './pages/Templates';
import { TemplateDetails } from './pages/TemplateDetails';
import { Showcase } from './pages/Showcase';
import { ShowcaseDetails } from './pages/ShowcaseDetails';
import { CustomProject } from './pages/CustomProject';
import { AdminVerification } from './pages/AdminVerification';
import Todos from './pages/Todos';
import Checkout from './pages/Checkout';

const ProtectedRoute = ({ children, requiredRole }: { children: React.ReactNode, requiredRole?: string }) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const hasAdminAccess = localStorage.getItem('wcs_admin_access') === 'true';

  if (requiredRole === 'admin' && hasAdminAccess) {
    return <>{children}</>;
  }

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/templates" element={<Templates />} />
              <Route path="/templates/:id" element={<TemplateDetails />} />
              <Route path="/showcase" element={<Showcase />} />
              <Route path="/showcase/:id" element={<ShowcaseDetails />} />
              <Route path="/custom-project" element={<CustomProject />} />
              <Route path="/wcs-admin-verify" element={<AdminVerification />} />
              <Route path="/todos" element={<Todos />} />
              <Route path="/checkout/:type/:id" element={<Checkout />} />
              
              {/* Protected Routes */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/*" 
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              
              {/* Catch all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}

export default App;
