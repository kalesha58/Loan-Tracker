import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route, Navigate, useLocation } from "react-router-dom";
import ScrollToTop from "components/ui/Scrolllallop";
import ErrorBoundary from "components/ui/ErrorBoundary";
import ProtectedRoute from "components/auth/ProtectedRoute";
import PublicRoute from "components/auth/PublicRoute";
import ChatbotButton from "components/chatbot/ChatbotButton";
import NotFound from "pages/NotFound";
import LoginPage from './pages/login';
import Dashboard from './pages/dashboard';
import LoanDetailsPage from './pages/loan-details';
import LoansListPage from './pages/loans-list';
import PersonalLoansPage from './pages/personal-loans';
import AddPersonalLoanPage from './pages/personal-loans/add';
import AddBusinessLoanPage from './pages/business-loans/add';
import AddVehicleLoanPage from './pages/vehicle-loans/add';
import DocumentsWorkflowPage from './pages/documents-workflow';
import ProfilePage from './pages/profile';
import { isAuthenticated } from './utils/auth';

const ChatbotWrapper: React.FC = () => {
  const location = useLocation();
  const authenticated = isAuthenticated();
  const isLoginPage = location.pathname === '/login';

  // Only show chatbot on authenticated pages (not on login page)
  if (authenticated && !isLoginPage) {
    return <ChatbotButton />;
  }

  return null;
};

const Routes: React.FC = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <ChatbotWrapper />
        <RouterRoutes>
          {/* Public Route - Login Page */}
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            } 
          />

          {/* Root route - redirect based on auth status */}
          <Route 
            path="/" 
            element={
              isAuthenticated() ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
            } 
          />

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
            path="/loan-details" 
            element={
              <ProtectedRoute>
                <LoanDetailsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/loans-list" 
            element={
              <ProtectedRoute>
                <LoansListPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/personal-loans" 
            element={
              <ProtectedRoute>
                <PersonalLoansPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/personal-loans/add" 
            element={
              <ProtectedRoute>
                <AddPersonalLoanPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/business-loans/add" 
            element={
              <ProtectedRoute>
                <AddBusinessLoanPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/vehicle-loans/add" 
            element={
              <ProtectedRoute>
                <AddVehicleLoanPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/documents-workflow" 
            element={
              <ProtectedRoute>
                <DocumentsWorkflowPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } 
          />

          {/* 404 Not Found */}
          <Route path="*" element={<NotFound />} />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
