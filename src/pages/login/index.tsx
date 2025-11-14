import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginHeader from './components/LoginHeader';
import LoginForm from './components/LoginForm';
import SecurityBadges from './components/SecurityBadges';
import Icon from '../../components/ui/AppIcon';
import { LoginFormData, User } from './types';

const LoginPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDemoCredentials, setShowDemoCredentials] = useState(false);

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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      {/* Modern Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900"></div>
      
      {/* Animated Gradient Orbs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      
      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] dark:opacity-[0.05]"></div>
      
      {/* Login Container */}
      <div className="relative w-full max-w-md z-10">
        <div className="bg-card/80 dark:bg-slate-800/80 backdrop-blur-xl border border-border/50 dark:border-slate-700/50 rounded-3xl shadow-2xl p-6 md:p-8 transition-all duration-300">
          {/* Demo Credentials - Collapsible at Top */}
          <div className="mb-6">
            <button
              type="button"
              onClick={() => setShowDemoCredentials(!showDemoCredentials)}
              className="w-full flex items-center justify-between p-3 bg-primary/5 dark:bg-primary/10 border border-primary/20 dark:border-primary/30 rounded-lg hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors"
            >
              <div className="flex items-center gap-1.5">
                <Icon name="Info" size={14} className="text-primary dark:text-blue-400" />
                <span className="text-xs font-semibold text-foreground dark:text-slate-200">
                  Demo Credentials
                </span>
              </div>
              <Icon 
                name={showDemoCredentials ? "ChevronUp" : "ChevronDown"} 
                size={16} 
                className="text-primary dark:text-blue-400 transition-transform"
              />
            </button>
            
            {showDemoCredentials && (
              <div className="mt-2 p-3 bg-primary/5 dark:bg-primary/10 border border-primary/20 dark:border-primary/30 rounded-lg">
                <div className="space-y-1.5 text-xs text-muted-foreground dark:text-slate-400">
                  <div className="flex items-start gap-2">
                    <span className="font-medium text-foreground dark:text-slate-300 min-w-[80px] text-[11px]">Loan Officer:</span>
                    <span className="font-mono text-[11px] break-all">officer@loantracker.com / officer123</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-medium text-foreground dark:text-slate-300 min-w-[80px] text-[11px]">Borrower:</span>
                    <span className="font-mono text-[11px] break-all">borrower@example.com / borrower123</span>
                  </div>
                </div>
              </div>
            )}
          </div>

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
      </div>

      {/* Custom CSS for animations and patterns */}
      <style>{`
        .bg-grid-pattern {
          background-image: radial-gradient(circle, currentColor 1px, transparent 1px);
          background-size: 24px 24px;
        }
        
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default LoginPage;