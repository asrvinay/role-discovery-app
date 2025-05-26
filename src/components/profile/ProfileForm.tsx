
import React from 'react';
import { useProfileData } from '@/hooks/useProfileData';
import { useProfileSave } from '@/hooks/useProfileSave';
import { useProfileInput } from '@/hooks/useProfileInput';
import JobPreferencesSection from './JobPreferencesSection';
import ProfileActions from './ProfileActions';

const ProfileForm: React.FC = () => {
  const {
    profileData,
    isLoading,
    handleAddJobTitle,
    handleRemoveJobTitle,
    handleAddLocation,
    handleRemoveLocation,
    handleYearsExperienceChange,
  } = useProfileData();

  const { handleSave, isSaving } = useProfileSave();
  
  const {
    currentInput,
    setCurrentInput,
    inputType,
    setInputType,
  } = useProfileInput();

  const onSave = () => handleSave(profileData);

  if (isLoading) {
    return (
      <div className="text-center">Loading your preferences...</div>
    );
  }

  return (
    <div className="space-y-6">
      <JobPreferencesSection
        jobTitles={profileData.jobTitles}
        locations={profileData.locations}
        yearsExperience={profileData.yearsExperience}
        onAddJobTitle={handleAddJobTitle}
        onRemoveJobTitle={handleRemoveJobTitle}
        onAddLocation={handleAddLocation}
        onRemoveLocation={handleRemoveLocation}
        onYearsExperienceChange={handleYearsExperienceChange}
        inputType={inputType}
        setInputType={setInputType}
        currentInput={currentInput}
        setCurrentInput={setCurrentInput}
      />

      <ProfileActions 
        onSave={onSave} 
        isSaving={isSaving} 
        buttonText={isSaving ? 'Saving Profile...' : 'Save Profile & Search Jobs'}
      />
    </div>
  );
};

export default ProfileForm;
