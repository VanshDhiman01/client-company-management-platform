import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { UnauthorizedPage } from './components/common/UnauthorizedPage';
import { AuthPage } from './components/auth/AuthPage';

// Client Components
import { ClientDashboard } from './components/client/ClientDashboard';
import { ClientProjects } from './components/client/ClientProjects';
import { ClientProjectDetails } from './components/client/ClientProjectDetails';
import { ClientProjectRequest } from './components/client/ClientProjectRequest';
import { ClientMessages } from './components/client/ClientMessages';
import { ClientProfile } from './components/client/ClientProfile';

// Admin Components
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminClients } from './components/admin/AdminClients';
import { AdminProjectRequests } from './components/admin/AdminProjectRequests';
import { AdminProjects } from './components/admin/AdminProjects';
import { AdminProjectDetails } from './components/admin/AdminProjectDetails';
import { AdminTasks } from './components/admin/AdminTasks';
import { AdminDevelopers } from './components/admin/AdminDevelopers';
import { AdminMessages } from './components/admin/AdminMessages';
import { AdminProfile } from './components/admin/AdminProfile';

// Developer Components
import { DeveloperDashboard } from './components/developer/DeveloperDashboard';
import { DeveloperProjects } from './components/developer/DeveloperProjects';
import { DeveloperTasks } from './components/developer/DeveloperTasks';
import { DeveloperProfile } from './components/developer/DeveloperProfile';

/**
 * Public Route wrapper: if user is already logged in, redirect to their role dashboard
 */
const PublicAuthRoute = () => {
  const { isLoggedIn, currentUser, isAuthLoading } = useApp();

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white font-sans">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-medium text-slate-300">Authenticating session...</span>
        </div>
      </div>
    );
  }

  if (isLoggedIn && currentUser) {
    if (currentUser.role === 'CLIENT') {
      return <Navigate to="/client/dashboard" replace />;
    } else if (currentUser.role === 'ADMIN') {
      return <Navigate to="/admin/dashboard" replace />;
    } else {
      return <Navigate to="/developer/dashboard" replace />;
    }
  }
  return <AuthPage />;
};

/**
 * Root / Fallback Redirection based on Authentication and Role
 */
const RootRedirect = () => {
  const { isLoggedIn, currentUser, isAuthLoading } = useApp();
  const location = useLocation();

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white font-sans">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-medium text-slate-300">Authenticating session...</span>
        </div>
      </div>
    );
  }

  if (!isLoggedIn || !currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (currentUser.role === 'CLIENT') {
    return <Navigate to="/client/dashboard" replace />;
  } else if (currentUser.role === 'ADMIN') {
    return <Navigate to="/admin/dashboard" replace />;
  } else {
    return <Navigate to="/developer/dashboard" replace />;
  }
};

/**
 * Main Layout Shell for authenticated role routes
 */
const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 antialiased selection:bg-indigo-500 selection:text-white">
      <div className="flex-1 flex">
        {/* Left Sidebar */}
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        {/* Right Main Container */}
        <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
          {/* Header */}
          <Header onMobileMenuToggle={() => setIsSidebarOpen(true)} />

          {/* Main App Content Area */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-fadeIn">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Routes>
          {/* Public Authentication Route */}
          <Route path="/login" element={<PublicAuthRoute />} />

          {/* 1. Client Protected Routes (RBAC: CLIENT only) */}
          <Route
            path="/client"
            element={
              <ProtectedRoute allowedRoles={['CLIENT']}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/client/dashboard" replace />} />
            <Route path="dashboard" element={<ClientDashboard />} />
            <Route path="projects" element={<ClientProjects />} />
            <Route path="projects/:id" element={<ClientProjectDetails />} />
            <Route path="requests" element={<ClientProjectRequest />} />
            <Route path="messages" element={<ClientMessages />} />
            <Route path="profile" element={<ClientProfile />} />
          </Route>

          {/* 2. Admin Protected Routes (RBAC: ADMIN only) */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="clients" element={<AdminClients />} />
            <Route path="requests" element={<AdminProjectRequests />} />
            <Route path="projects" element={<AdminProjects />} />
            <Route path="projects/:id" element={<AdminProjectDetails />} />
            <Route path="tasks" element={<AdminTasks />} />
            <Route path="developers" element={<AdminDevelopers />} />
            <Route path="messages" element={<AdminMessages />} />
            <Route path="profile" element={<AdminProfile />} />
          </Route>

          {/* 3. Developer Protected Routes (RBAC: DEVELOPER only) */}
          <Route
            path="/developer"
            element={
              <ProtectedRoute allowedRoles={['DEVELOPER']}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/developer/dashboard" replace />} />
            <Route path="dashboard" element={<DeveloperDashboard />} />
            <Route path="projects" element={<DeveloperProjects />} />
            <Route path="projects/:id" element={<DeveloperProjects />} />
            <Route path="tasks" element={<DeveloperTasks />} />
            <Route path="profile" element={<DeveloperProfile />} />
          </Route>

          {/* Unauthorized 403 Page */}
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* Root and Catch-all Redirection */}
          <Route path="/" element={<RootRedirect />} />
          <Route path="*" element={<RootRedirect />} />
        </Routes>
      </AppProvider>
    </BrowserRouter>
  );
}
