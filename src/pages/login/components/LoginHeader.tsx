import React from 'react';

import Icon from '../../../components/ui/AppIcon';

const LoginHeader = () => {
  return (
    <div className="text-center mb-6">
      {/* Logo */}
      <div className="flex items-center justify-center mb-4">
        <div className="relative">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg shadow-primary/25 dark:shadow-primary/40">
            <Icon name="DollarSign" size={28} color="white" />
          </div>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-success rounded-full border-2 border-card dark:border-slate-800"></div>
        </div>
        <h1 className="ml-3 text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400">
          LoanTracker
        </h1>
      </div>

      {/* Welcome Message */}
      <div className="space-y-1">
        <h2 className="text-xl font-semibold text-foreground dark:text-slate-100">
          Welcome Back
        </h2>
        <p className="text-muted-foreground dark:text-slate-400 text-sm max-w-sm mx-auto">
          Sign in to your account to continue
        </p>
      </div>
    </div>
  );
};

export default LoginHeader;

