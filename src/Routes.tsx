import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ui/Scrolllallop";
import ErrorBoundary from "components/ui/ErrorBoundary";
import NotFound from "pages/NotFound";
import LoginPage from './pages/login';
import Dashboard from './pages/dashboard';
import LoanDetailsPage from './pages/loan-details';
import LoansListPage from './pages/loans-list';
import PersonalLoansPage from './pages/personal-loans';
import DocumentsWorkflowPage from './pages/documents-workflow';
import ProfilePage from './pages/profile';

const Routes: React.FC = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <RouterRoutes>
          {/* Define your routes here */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/loan-details" element={<LoanDetailsPage />} />
        <Route path="/loans-list" element={<LoansListPage />} />
        <Route path="/personal-loans" element={<PersonalLoansPage />} />
        <Route path="/documents-workflow" element={<DocumentsWorkflowPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<NotFound />} />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
