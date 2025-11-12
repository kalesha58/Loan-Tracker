export interface IUserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  department?: string;
  avatar?: string;
  joinDate: Date;
  lastLogin?: Date;
  status: 'active' | 'inactive' | 'suspended';
}

export interface IProfileStats {
  totalLoansProcessed: number;
  totalAmountProcessed: number;
  averageProcessingTime: number;
  approvalRate: number;
  pendingTasks: number;
}

export interface IActivityLog {
  id: string;
  action: string;
  description: string;
  timestamp: Date;
  ipAddress?: string;
  location?: string;
}

export interface INotificationPreferences {
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  loanUpdates: boolean;
  documentApprovals: boolean;
  paymentReminders: boolean;
  systemAlerts: boolean;
}

export interface IChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface IProfileUpdateData {
  name: string;
  phone?: string;
  department?: string;
}

