import React from 'react';

import Icon from '../../../components/ui/AppIcon';
import Button from '../../../components/ui/Button';
import { IUserProfile } from '../types';

interface ProfileHeaderProps {
  profile: IUserProfile;
  onEditProfile: () => void;
  onUploadAvatar: () => void;
}

const ProfileHeader = ({ profile, onEditProfile, onUploadAvatar }: ProfileHeaderProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-success/10 text-success border-success/20';
      case 'inactive':
        return 'bg-muted text-muted-foreground border-border';
      case 'suspended':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(date);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
        {/* Avatar Section */}
        <div className="relative">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-primary/10 flex items-center justify-center border-4 border-card shadow-sm">
            {profile.avatar ? (
              <img
                src={profile.avatar}
                alt={profile.name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-2xl sm:text-3xl font-semibold text-primary">
                {profile.name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <button
            onClick={onUploadAvatar}
            className="absolute bottom-0 right-0 w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-full flex items-center justify-center border-4 border-card shadow-sm hover:bg-primary/90 transition-colors"
          >
            <Icon name="Camera" size={16} className="text-primary-foreground" />
          </button>
        </div>

        {/* Profile Info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
            <h1 className="text-xl sm:text-2xl font-semibold text-foreground truncate">
              {profile.name}
            </h1>
            <div className={`px-2.5 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium border flex-shrink-0 ${getStatusColor(profile.status)}`}>
              {profile.status}
            </div>
          </div>
          
          <div className="space-y-1 sm:space-y-2">
            <div className="flex items-center gap-2 text-sm sm:text-base text-muted-foreground">
              <Icon name="Mail" size={16} />
              <span className="truncate">{profile.email}</span>
            </div>
            {profile.phone && (
              <div className="flex items-center gap-2 text-sm sm:text-base text-muted-foreground">
                <Icon name="Phone" size={16} />
                <span>{profile.phone}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm sm:text-base text-muted-foreground">
              <Icon name="Briefcase" size={16} />
              <span>{profile.role}</span>
              {profile.department && <span className="text-muted-foreground">• {profile.department}</span>}
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
              <Icon name="Calendar" size={14} />
              <span>Joined: {formatDate(profile.joinDate)}</span>
              {profile.lastLogin && (
                <>
                  <span>•</span>
                  <span>Last login: {formatDate(profile.lastLogin)}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button
            variant="default"
            iconName="Edit"
            iconPosition="left"
            onClick={onEditProfile}
            className="w-full sm:w-auto"
          >
            Edit Profile
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;

