import React from 'react';

import Icon from '../../../components/ui/AppIcon';

const LoginHeader = () => {
  return (
    <div className="text-center mb-8">
      {/* Logo */}
      <div className="flex items-center justify-center mb-6">
        <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg">
          <Icon name="DollarSign" size={28} color="white" />
        </div>
        <h1 className="ml-3 text-2xl font-bold text-foreground">LoanTracker</h1>
      </div>

      {/* Welcome Message */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-foreground">
          Welcome Back
        </h2>
        <p className="text-muted-foreground text-sm max-w-sm mx-auto">
          Sign in to your account to manage loans, track documents, and streamline your lending workflow
        </p>
      </div>

      {/* Value Proposition */}
      <div className="mt-6 grid grid-cols-3 gap-4 text-center">
        <div className="space-y-1">
          <Icon name="FileText" size={20} className="mx-auto text-primary" />
          <p className="text-xs text-muted-foreground">Document Management</p>
        </div>
        <div className="space-y-1">
          <Icon name="TrendingUp" size={20} className="mx-auto text-primary" />
          <p className="text-xs text-muted-foreground">Real-time Tracking</p>
        </div>
        <div className="space-y-1">
          <Icon name="Users" size={20} className="mx-auto text-primary" />
          <p className="text-xs text-muted-foreground">Multi-user Access</p>
        </div>
      </div>
    </div>
  );
};

export default LoginHeader;

