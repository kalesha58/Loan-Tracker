import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginHeader from './components/LoginHeader';
import LoginForm from './components/LoginForm';
import SecurityBadges from './components/SecurityBadges';
import { LoginFormData, User } from './types';

const LoginPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock credentials for different user types
  const mockCredentials = {
    loanOfficer: {
      email: 'officer@loantracker.com',
      password: 'officer123'
    },
    borrower: {
      email: 'borrower@example.com',
      password: 'borrower123'
    }
  };

  const handleLogin = async (formData: LoginFormData): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock authentication logic
      let authenticatedUser: User | null = null;

      if (
        formData.email === mockCredentials.loanOfficer.email &&
        formData.password === mockCredentials.loanOfficer.password
      ) {
        authenticatedUser = {
          id: '1',
          name: 'Sarah Johnson',
          email: formData.email,
          role: 'loan_officer',
          avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
        };
      } else if (
        formData.email === mockCredentials.borrower.email &&
        formData.password === mockCredentials.borrower.password
      ) {
        authenticatedUser = {
          id: '2',
          name: 'Michael Chen',
          email: formData.email,
          role: 'borrower',
          avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
        };
      }

      if (authenticatedUser) {
        // Store user data in localStorage (in real app, use proper auth state management)
        localStorage.setItem('user', JSON.stringify(authenticatedUser));
        localStorage.setItem('isAuthenticated', 'true');
        
        if (formData.rememberMe) {
          localStorage.setItem('rememberMe', 'true');
        }

        // Navigate to dashboard
        navigate('/dashboard');
      } else {
        setError('Invalid email or password. Please check your credentials and try again.');
      }
    } catch (err) {
      setError('Login failed. Please check your internet connection and try again.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      {/* Login Container */}
      <div className="relative w-full max-w-md">
        <div className="bg-card border border-border rounded-2xl shadow-modal p-8">
          {/* Login Header */}
          <LoginHeader />

          {/* Login Form */}
          <LoginForm
            onSubmit={handleLogin}
            isLoading={isLoading}
            error={error}
          />

          {/* Security Badges */}
          <SecurityBadges />
        </div>

        {/* Demo Credentials Info */}
        <div className="mt-6 p-4 bg-muted/50 border border-border rounded-lg">
          <h3 className="text-sm font-medium text-foreground mb-2">Demo Credentials:</h3>
          <div className="space-y-2 text-xs text-muted-foreground">
            <div>
              <strong>Loan Officer:</strong> officer@loantracker.com / officer123
            </div>
            <div>
              <strong>Borrower:</strong> borrower@example.com / borrower123
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for grid pattern */}
      <style>{`
        .bg-grid-pattern {
          background-image: radial-gradient(circle, #e2e8f0 1px, transparent 1px);
          background-size: 20px 20px;
        }
      `}</style>
    </div>
  );
};

export default LoginPage;