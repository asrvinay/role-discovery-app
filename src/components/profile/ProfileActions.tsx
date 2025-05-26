
import React from 'react';
import { Button } from '@/components/ui/button';

interface ProfileActionsProps {
  onSave: () => void;
  isSaving: boolean;
  buttonText?: string;
}

const ProfileActions: React.FC<ProfileActionsProps> = ({ 
  onSave, 
  isSaving, 
  buttonText = 'Save Profile' 
}) => {
  return (
    <div className="flex justify-end">
      <Button onClick={onSave} size="lg" disabled={isSaving}>
        {buttonText}
      </Button>
    </div>
  );
};

export default ProfileActions;
