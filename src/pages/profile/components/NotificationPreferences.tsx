import React, { useState } from 'react';

import Icon from '../../../components/ui/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import { INotificationPreferences } from '../types';

interface NotificationPreferencesProps {
  preferences: INotificationPreferences;
  onUpdate: (preferences: INotificationPreferences) => void;
}

const NotificationPreferences = ({ preferences, onUpdate }: NotificationPreferencesProps) => {
  const [localPreferences, setLocalPreferences] = useState<INotificationPreferences>(preferences);
  const [hasChanges, setHasChanges] = useState(false);

  const handleToggle = (key: keyof INotificationPreferences) => {
    const updated = { ...localPreferences, [key]: !localPreferences[key] };
    setLocalPreferences(updated);
    setHasChanges(JSON.stringify(updated) !== JSON.stringify(preferences));
  };

  const handleSave = () => {
    onUpdate(localPreferences);
    setHasChanges(false);
  };

  const handleReset = () => {
    setLocalPreferences(preferences);
    setHasChanges(false);
  };

  const notificationOptions = [
    {
      key: 'emailNotifications' as keyof INotificationPreferences,
      label: 'Email Notifications',
      description: 'Receive notifications via email',
      icon: 'Mail'
    },
    {
      key: 'pushNotifications' as keyof INotificationPreferences,
      label: 'Push Notifications',
      description: 'Receive browser push notifications',
      icon: 'Bell'
    },
    {
      key: 'smsNotifications' as keyof INotificationPreferences,
      label: 'SMS Notifications',
      description: 'Receive notifications via SMS',
      icon: 'Phone'
    },
    {
      key: 'loanUpdates' as keyof INotificationPreferences,
      label: 'Loan Updates',
      description: 'Get notified about loan status changes',
      icon: 'FileText'
    },
    {
      key: 'documentApprovals' as keyof INotificationPreferences,
      label: 'Document Approvals',
      description: 'Notifications for document approval requests',
      icon: 'CheckCircle'
    },
    {
      key: 'paymentReminders' as keyof INotificationPreferences,
      label: 'Payment Reminders',
      description: 'Reminders for upcoming payments',
      icon: 'CreditCard'
    },
    {
      key: 'systemAlerts' as keyof INotificationPreferences,
      label: 'System Alerts',
      description: 'Important system-wide alerts and announcements',
      icon: 'AlertCircle'
    }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center gap-2">
          <Icon name="Bell" size={20} className="text-primary" />
          <h2 className="text-lg sm:text-xl font-semibold text-foreground">
            Notification Preferences
          </h2>
        </div>
        {hasChanges && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
            >
              Reset
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleSave}
            >
              Save Changes
            </Button>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {notificationOptions.map((option) => (
          <div
            key={option.key}
            className="flex items-start justify-between p-3 sm:p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-start gap-3 flex-1">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon name={option.icon} size={18} className="text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm sm:text-base font-medium text-foreground mb-1">
                  {option.label}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {option.description}
                </p>
              </div>
            </div>
            <Checkbox
              checked={localPreferences[option.key] as boolean}
              onChange={() => handleToggle(option.key)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationPreferences;

