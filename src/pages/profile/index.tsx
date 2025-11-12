import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import ProfileHeader from './components/ProfileHeader';
import ProfileStats from './components/ProfileStats';
import ProfileInformation from './components/ProfileInformation';
import ChangePassword from './components/ChangePassword';
import NotificationPreferences from './components/NotificationPreferences';
import ActivityLog from './components/ActivityLog';
import { handleLogout as logout } from '../../utils/auth';
import { getCurrentUser } from '../../utils/auth';
import {
  IUserProfile,
  IProfileStats,
  IActivityLog,
  INotificationPreferences,
  IChangePasswordData,
  IProfileUpdateData
} from './types';

const ProfilePage = () => {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  const [user] = useState({
    name: currentUser?.name || 'John Smith',
    email: currentUser?.email || 'john.smith@loantracker.com',
    role: currentUser?.role || 'Loan Officer'
  });

  const [profile] = useState<IUserProfile>({
    id: 'EMP001',
    name: user.name,
    email: user.email,
    phone: '+91 98765 43210',
    role: user.role,
    department: 'Loan Processing',
    joinDate: new Date('2023-01-15'),
    lastLogin: new Date(),
    status: 'active'
  });

  const [stats] = useState<IProfileStats>({
    totalLoansProcessed: 247,
    totalAmountProcessed: 12500000,
    averageProcessingTime: 48,
    approvalRate: 87.5,
    pendingTasks: 12
  });

  const [activities, setActivities] = useState<IActivityLog[]>([
    {
      id: '1',
      action: 'Logged in',
      description: 'Successfully logged into the system',
      timestamp: new Date(Date.now() - 300000),
      ipAddress: '192.168.1.100',
      location: 'Bangalore, India'
    },
    {
      id: '2',
      action: 'Approved Loan',
      description: 'Approved loan application LN001 for Rajesh Kumar',
      timestamp: new Date(Date.now() - 7200000),
      ipAddress: '192.168.1.100',
      location: 'Bangalore, India'
    },
    {
      id: '3',
      action: 'Updated Document',
      description: 'Updated document status for loan LN002',
      timestamp: new Date(Date.now() - 14400000),
      ipAddress: '192.168.1.100',
      location: 'Bangalore, India'
    },
    {
      id: '4',
      action: 'Created Comment',
      description: 'Added internal comment on loan LN003',
      timestamp: new Date(Date.now() - 21600000),
      ipAddress: '192.168.1.100',
      location: 'Bangalore, India'
    },
    {
      id: '5',
      action: 'Logged out',
      description: 'Logged out from the system',
      timestamp: new Date(Date.now() - 86400000),
      ipAddress: '192.168.1.100',
      location: 'Bangalore, India'
    }
  ]);

  const [notificationPreferences, setNotificationPreferences] = useState<INotificationPreferences>({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    loanUpdates: true,
    documentApprovals: true,
    paymentReminders: true,
    systemAlerts: true
  });

  const handleLogout = () => {
    logout(navigate);
  };

  const handleEditProfile = () => {
    // This would open a modal or navigate to edit page
    console.log('Edit profile');
  };

  const handleUploadAvatar = () => {
    // This would open file picker for avatar upload
    console.log('Upload avatar');
  };

  const handleUpdateProfile = (data: IProfileUpdateData) => {
    console.log('Update profile:', data);
    // Update profile logic here
  };

  const handleChangePassword = async (data: IChangePasswordData) => {
    console.log('Change password:', data);
    // Change password logic here
  };

  const handleUpdateNotifications = (preferences: INotificationPreferences) => {
    setNotificationPreferences(preferences);
    console.log('Update notifications:', preferences);
    // Update notification preferences logic here
  };

  return (
    <>
      <Helmet>
        <title>Profile - LoanTracker</title>
        <meta name="description" content="Manage your profile, settings, and preferences" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header user={user} onLogout={handleLogout} />
        
        <main className="pt-16">
          <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
            {/* Breadcrumb */}
            <Breadcrumb className="mb-4 sm:mb-6" />

            {/* Page Header */}
            <div className="mb-4 sm:mb-6">
              <h1 className="text-xl sm:text-2xl font-semibold text-foreground">
                Profile Settings
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground mt-1">
                Manage your account information, preferences, and security settings
              </p>
            </div>

            {/* Profile Header */}
            <ProfileHeader
              profile={profile}
              onEditProfile={handleEditProfile}
              onUploadAvatar={handleUploadAvatar}
            />

            {/* Profile Stats */}
            <ProfileStats stats={stats} />

            {/* Profile Information */}
            <ProfileInformation
              profile={profile}
              onUpdate={handleUpdateProfile}
            />

            {/* Change Password */}
            <ChangePassword onChangePassword={handleChangePassword} />

            {/* Notification Preferences */}
            <NotificationPreferences
              preferences={notificationPreferences}
              onUpdate={handleUpdateNotifications}
            />

            {/* Activity Log */}
            <ActivityLog activities={activities} />
          </div>
        </main>
      </div>
    </>
  );
};

export default ProfilePage;

