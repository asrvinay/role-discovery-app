
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ProfileData, InputType } from '@/types/profile';
import JobPreferencesSection from './JobPreferencesSection';
import ProfileActions from './ProfileActions';

interface Job {
  title: string;
  company: string;
  location: string;
  salary?: string;
  description: string;
  source?: string;
}

const ProfileForm: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [profileData, setProfileData] = useState<ProfileData>({
    jobTitles: [],
    locations: [],
    yearsExperience: 0,
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

  const searchJobs = async () => {
    try {
      console.log('Searching for jobs with preferences:', profileData);
      
      const { data, error } = await supabase.functions.invoke('ai-job-search', {
        body: profileData
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }

      console.log('Job search response:', data);
      
      if (data?.jobs) {
        toast({
          title: "Profile saved and jobs found!",
          description: `Found ${data.jobs.length} job recommendations for you.`,
        });
        
        // Navigate to job recommendations page
        navigate('/job-recommendations');
      } else {
        throw new Error('No jobs found in response');
      }
    } catch (error) {
      console.error('Error searching for jobs:', error);
      toast({
        title: "Profile saved, but job search failed",
        description: "Your preferences were saved. You can search for jobs manually from the job recommendations page.",
        variant: "destructive",
      });
      
      // Still navigate to job recommendations page even if search failed
      navigate('/job-recommendations');
    }
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

    // Validate that user has added some preferences
    if (profileData.jobTitles.length === 0 && profileData.locations.length === 0) {
      toast({
        title: "Missing information",
        description: "Please add at least one job title or location to continue.",
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
        skills: [],
        industries: [],
        employment_types: [],
        salary_min: 0,
        salary_max: 0,
        remote_preference: false,
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

      // After saving successfully, run the AI job search
      await searchJobs();
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

      <ProfileActions 
        onSave={handleSave} 
        isSaving={isSaving} 
        buttonText={isSaving ? 'Saving & Searching...' : 'Complete Profile & Find Jobs'} 
      />
    </div>
  );
};

export default ProfileForm;
