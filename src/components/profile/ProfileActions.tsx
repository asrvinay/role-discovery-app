
import React from 'react';
import { Button } from '@/components/ui/button';

interface ProfileActionsProps {
  onSave: () => void;
  isSaving: boolean;
}

const ProfileActions: React.FC<ProfileActionsProps> = ({ onSave, isSaving }) => {
  return (
    <div className="flex justify-end">
      <Button onClick={onSave} size="lg" disabled={isSaving}>
        {isSaving ? 'Saving...' : 'Save Profile'}
      </Button>
    </div>
  );
};

export default ProfileActions;
