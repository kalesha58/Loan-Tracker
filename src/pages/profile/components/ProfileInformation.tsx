import React, { useState } from 'react';

import Icon from '../../../components/ui/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { IUserProfile, IProfileUpdateData } from '../types';

interface ProfileInformationProps {
  profile: IUserProfile;
  onUpdate: (data: IProfileUpdateData) => void;
}

const ProfileInformation = ({ profile, onUpdate }: ProfileInformationProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<IProfileUpdateData>({
    name: profile.name,
    phone: profile.phone || '',
    department: profile.department || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: profile.name,
      phone: profile.phone || '',
      department: profile.department || ''
    });
    setIsEditing(false);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-foreground">
          Profile Information
        </h2>
        {!isEditing && (
          <Button
            variant="outline"
            size="sm"
            iconName="Edit"
            iconPosition="left"
            onClick={() => setIsEditing(true)}
          >
            Edit
          </Button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <Input
              label="Email"
              type="email"
              value={profile.email}
              disabled
              description="Email cannot be changed"
            />
            <Input
              label="Phone Number"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+91 98765 43210"
            />
            <Input
              label="Department"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              placeholder="Enter department"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
            <Button type="submit" variant="default" className="w-full sm:w-auto">
              Save Changes
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">
                Full Name
              </label>
              <p className="text-sm sm:text-base text-foreground">{profile.name}</p>
            </div>
            <div>
              <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">
                Email
              </label>
              <p className="text-sm sm:text-base text-foreground">{profile.email}</p>
            </div>
            {profile.phone && (
              <div>
                <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">
                  Phone Number
                </label>
                <p className="text-sm sm:text-base text-foreground">{profile.phone}</p>
              </div>
            )}
            {profile.department && (
              <div>
                <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">
                  Department
                </label>
                <p className="text-sm sm:text-base text-foreground">{profile.department}</p>
              </div>
            )}
            <div>
              <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">
                Role
              </label>
              <p className="text-sm sm:text-base text-foreground">{profile.role}</p>
            </div>
            <div>
              <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">
                Employee ID
              </label>
              <p className="text-sm sm:text-base text-foreground">{profile.id}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileInformation;

