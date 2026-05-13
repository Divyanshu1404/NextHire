import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ROLES } from '../constants/roles';

import RootLayout from '../components/layout/RootLayout';
import DashboardLayout from '../components/layout/DashboardLayout';

import Home from '../pages/Home';
import JobsPage from '../features/jobs/JobsPage';
import JobDetail from '../features/jobs/JobDetail';
import CompaniesPage from '../pages/CompaniesPage';

import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import EmployerLogin from '../pages/auth/EmployerLogin';
import EmployerSignup from '../pages/auth/EmployerSignup';

import UserDashboard from '../pages/dashboard/UserDashboard';
import RecruiterDashboard from '../pages/dashboard/RecruiterDashboard';
import CompanyAdminDashboard from '../pages/dashboard/CompanyAdminDashboard';
import Settings from '../pages/dashboard/Settings';
import SuperAdminDashboard from '../pages/dashboard/SuperAdminDashboard';
import KYCPage from '../pages/dashboard/KYCPage';
import Organization from '../pages/dashboard/Organization';
import MyApplications from '../pages/dashboard/MyApplications';
import JobApplications from '../pages/dashboard/JobApplications';
import HRDashboard from '../pages/dashboard/HRDashboard';
import CompanyCandidates from '../pages/dashboard/CompanyCandidates';
import ManageJobs from '../pages/dashboard/ManageJobs';
import CreateJob from '../pages/dashboard/CreateJob';
import EditJob from '../pages/dashboard/EditJob';
import UserProfile from '../pages/dashboard/UserProfile';

import ProtectedRoute from './ProtectedRoute';

const DashboardRouter = () => {
  const { role } = useSelector(state => state.auth);

  switch (role) {
    case ROLES.USER:
      return <UserDashboard />;
    case ROLES.RECRUITER:
      return <RecruiterDashboard />;
    case ROLES.HR:
      return <HRDashboard />;
    case ROLES.COMPANY_ADMIN:
      return <CompanyAdminDashboard />;
    case ROLES.SUPER_ADMIN:
      return <SuperAdminDashboard />;
    default:
      return <Navigate to="/login" />;
  }
};

const AppRoutes = () => {
  return (
    <Routes>
      
      <Route element={<RootLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/companies" element={<CompaniesPage />} />
        <Route path="/jobs/:id" element={<JobDetail />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/employer/login" element={<EmployerLogin />} />
        <Route path="/employer/register" element={<EmployerSignup />} />
      </Route>

      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardRouter />} />
        <Route path="settings" element={<Settings />} />
        <Route path="profile" element={<UserProfile />} />

        <Route 
          path="kyc" 
          element={
            <ProtectedRoute allowedRoles={[ROLES.COMPANY_ADMIN]}>
              <KYCPage />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="organization" 
          element={
            <ProtectedRoute allowedRoles={[ROLES.COMPANY_ADMIN]}>
              <Organization />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="jobs/:jobId/applications" 
          element={
            <ProtectedRoute allowedRoles={[ROLES.RECRUITER, ROLES.HR, ROLES.COMPANY_ADMIN, ROLES.SUPER_ADMIN]}>
              <JobApplications />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="jobs" 
          element={
            <ProtectedRoute allowedRoles={[ROLES.RECRUITER, ROLES.HR, ROLES.COMPANY_ADMIN, ROLES.SUPER_ADMIN]}>
              <ManageJobs />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="jobs/new" 
          element={
            <ProtectedRoute allowedRoles={[ROLES.RECRUITER, ROLES.HR, ROLES.SUPER_ADMIN]}>
              <CreateJob />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="jobs/edit/:id" 
          element={
            <ProtectedRoute allowedRoles={[ROLES.RECRUITER, ROLES.HR, ROLES.SUPER_ADMIN]}>
              <EditJob />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="candidates" 
          element={
            <ProtectedRoute allowedRoles={[ROLES.RECRUITER, ROLES.HR, ROLES.SUPER_ADMIN]}>
              <CompanyCandidates />
            </ProtectedRoute>
          } 
        />
        
        <Route path="applications" element={<MyApplications />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
