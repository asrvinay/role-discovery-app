
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ProfileData, InputType } from '@/types/profile';
import JobPreferencesSection from './JobPreferencesSection';
import SkillsExpertiseSection from './SkillsExpertiseSection';
import EmploymentPreferencesSection from './EmploymentPreferencesSection';
import ProfileActions from './ProfileActions';

const ProfileForm: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [profileData, setProfileData] = useState<ProfileData>({
    jobTitles: [],
    locations: [],
    yearsExperience: 0,
    skills: [],
    industries: [],
    employmentTypes: [],
    salaryMin: 0,
    salaryMax: 0,
    remotePreference: false,
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [currentInput, setCurrentInput] = useState('');
  const [inputType, setInputType] = useState<InputType>(null);

  useEffect(() => {
    if (user) {
      loadJobPreferences();
    }
  }, [user]);

  const loadJobPreferences = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('job_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading job preferences:', error);
        return;
      }

      if (data) {
        setProfileData({
          jobTitles: data.job_titles || [],
          locations: data.locations || [],
          yearsExperience: data.years_experience || 0,
          skills: data.skills || [],
          industries: data.industries || [],
          employmentTypes: data.employment_types || [],
          salaryMin: data.salary_min || 0,
          salaryMax: data.salary_max || 0,
          remotePreference: data.remote_preference || false,
        });
      }
    } catch (error) {
      console.error('Error loading job preferences:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddJobTitle = (value: string) => {
    if (!value.trim()) return;
    setProfileData(prev => ({ ...prev, jobTitles: [...prev.jobTitles, value] }));
  };

  const handleRemoveJobTitle = (index: number) => {
    setProfileData(prev => ({
      ...prev,
      jobTitles: prev.jobTitles.filter((_, i) => i !== index)
    }));
  };

  const handleAddLocation = (value: string) => {
    if (!value.trim()) return;
    setProfileData(prev => ({ ...prev, locations: [...prev.locations, value] }));
  };

  const handleRemoveLocation = (index: number) => {
    setProfileData(prev => ({
      ...prev,
      locations: prev.locations.filter((_, i) => i !== index)
    }));
  };

  const handleAddSkill = (value: string) => {
    if (!value.trim()) return;
    setProfileData(prev => ({ ...prev, skills: [...prev.skills, value] }));
  };

  const handleRemoveSkill = (index: number) => {
    setProfileData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const handleAddIndustry = (value: string) => {
    if (!value.trim()) return;
    setProfileData(prev => ({ ...prev, industries: [...prev.industries, value] }));
  };

  const handleRemoveIndustry = (index: number) => {
    setProfileData(prev => ({
      ...prev,
      industries: prev.industries.filter((_, i) => i !== index)
    }));
  };

  const handleEmploymentTypeToggle = (type: string) => {
    setProfileData(prev => ({
      ...prev,
      employmentTypes: prev.employmentTypes.includes(type)
        ? prev.employmentTypes.filter(t => t !== type)
        : [...prev.employmentTypes, type]
    }));
  };

  const handleSave = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to save preferences.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      const preferences = {
        user_id: user.id,
        job_titles: profileData.jobTitles,
        locations: profileData.locations,
        years_experience: profileData.yearsExperience,
        skills: profileData.skills,
        industries: profileData.industries,
        employment_types: profileData.employmentTypes,
        salary_min: profileData.salaryMin,
        salary_max: profileData.salaryMax,
        remote_preference: profileData.remotePreference,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('job_preferences')
        .upsert(preferences, {
          onConflict: 'user_id'
        });

      if (error) {
        throw error;
      }

      toast({
        title: "Profile updated!",
        description: "Your job preferences have been saved successfully.",
      });

      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving job preferences:', error);
      toast({
        title: "Error",
        description: "Failed to save preferences. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

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
        onYearsExperienceChange={(value) => setProfileData(prev => ({ ...prev, yearsExperience: value }))}
        inputType={inputType}
        setInputType={setInputType}
        currentInput={currentInput}
        setCurrentInput={setCurrentInput}
      />

      <SkillsExpertiseSection
        skills={profileData.skills}
        industries={profileData.industries}
        onAddSkill={handleAddSkill}
        onRemoveSkill={handleRemoveSkill}
        onAddIndustry={handleAddIndustry}
        onRemoveIndustry={handleRemoveIndustry}
        inputType={inputType}
        setInputType={setInputType}
        currentInput={currentInput}
        setCurrentInput={setCurrentInput}
      />

      <EmploymentPreferencesSection
        employmentTypes={profileData.employmentTypes}
        salaryMin={profileData.salaryMin}
        salaryMax={profileData.salaryMax}
        remotePreference={profileData.remotePreference}
        onEmploymentTypeToggle={handleEmploymentTypeToggle}
        onSalaryMinChange={(value) => setProfileData(prev => ({ ...prev, salaryMin: value }))}
        onSalaryMaxChange={(value) => setProfileData(prev => ({ ...prev, salaryMax: value }))}
        onRemotePreferenceChange={(value) => setProfileData(prev => ({ ...prev, remotePreference: value }))}
      />

      <ProfileActions onSave={handleSave} isSaving={isSaving} />
    </div>
  );
};

export default ProfileForm;
