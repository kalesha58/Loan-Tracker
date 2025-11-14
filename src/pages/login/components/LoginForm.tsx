import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/ui/AppIcon';
import { LoginFormData, LoginFormErrors } from '../types';

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const LoginForm = ({ onSubmit, isLoading, error }: LoginFormProps) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    rememberMe: false
  });

  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: LoginFormErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
    } catch (err) {
      // Error is handled by parent component
    }
  };

  const handleInputChange = (field: keyof LoginFormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = field === 'rememberMe' ? e.target.checked : e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear field error when user starts typing
    if (errors[field as keyof LoginFormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Input */}
        <div className="space-y-1.5">
          <Input
            label="Email Address"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleInputChange('email')}
            error={errors.email}
            required
            disabled={isLoading}
            className="w-full transition-all duration-200 focus:ring-2 focus:ring-primary/20 dark:focus:ring-primary/30"
          />
        </div>

        {/* Password Input */}
        <div className="space-y-1.5">
          <div className="relative">
            <label
              htmlFor="password-input"
              className={`text-sm font-medium leading-none block mb-2 ${
                errors.password ? "text-destructive" : "text-foreground"
              }`}
            >
              Password
              <span className="text-destructive ml-1">*</span>
            </label>
            <div className="relative">
              <Input
                id="password-input"
                label=""
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange('password')}
                error={errors.password}
                required
                disabled={isLoading}
                className="w-full pr-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20 dark:focus:ring-primary/30"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[20px] text-muted-foreground hover:text-foreground dark:text-slate-400 dark:hover:text-slate-300 transition-colors focus:outline-none disabled:opacity-50 z-10"
                tabIndex={-1}
                disabled={isLoading}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <Icon 
                  name={showPassword ? "EyeOff" : "Eye"} 
                  size={18} 
                  className="text-muted-foreground dark:text-slate-400"
                />
              </button>
            </div>
          </div>
        </div>

        {/* Remember Me Checkbox */}
        <div className="flex items-center justify-between">
          <Checkbox
            label="Remember me"
            checked={formData.rememberMe}
            onChange={handleInputChange('rememberMe')}
            disabled={isLoading}
          />
          
          <button
            type="button"
            onClick={() => navigate('/forgot-password')}
            className="text-sm font-medium text-primary hover:text-primary/80 dark:text-blue-400 dark:hover:text-blue-300 transition-all duration-200 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            Forgot Password?
          </button>
        </div>

        {/* General Error Message */}
        {error && (
          <div className="flex items-start space-x-2 p-3 bg-destructive/10 dark:bg-destructive/20 border border-destructive/30 dark:border-destructive/40 rounded-lg animate-shake">
            <Icon name="AlertCircle" size={16} className="text-destructive dark:text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-destructive dark:text-red-400 leading-relaxed">{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          variant="default"
          size="lg"
          fullWidth
          loading={isLoading}
          disabled={isLoading}
          iconName="LogIn"
          iconPosition="right"
          className="h-11 text-base font-semibold shadow-lg shadow-primary/25 dark:shadow-primary/40 hover:shadow-xl hover:shadow-primary/30 dark:hover:shadow-primary/50 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
        >
          {isLoading ? 'Signing In...' : 'Sign In'}
        </Button>

        {/* Create Account Link */}
        <div className="text-center pt-2">
          <p className="text-sm text-muted-foreground dark:text-slate-400">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => navigate('/register')}
              className="text-primary dark:text-blue-400 hover:text-primary/80 dark:hover:text-blue-300 font-semibold transition-all duration-200 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              Create Account
            </button>
          </p>
        </div>
      </form>

      <style>{`
        @keyframes shake {
          0%, 100% {
            transform: translateX(0);
          }
          10%, 30%, 50%, 70%, 90% {
            transform: translateX(-4px);
          }
          20%, 40%, 60%, 80% {
            transform: translateX(4px);
          }
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default LoginForm;

