
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { ProfileData } from '@/types/profile';

export const useProfileData = () => {
  const { user } = useAuth();
  
  const [profileData, setProfileData] = useState<ProfileData>({
    jobTitles: [],
    locations: [],
    yearsExperience: 0,
  });
  
  const [isLoading, setIsLoading] = useState(false);

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

  const handleYearsExperienceChange = (value: number) => {
    setProfileData(prev => ({ ...prev, yearsExperience: value }));
  };

  return {
    profileData,
    isLoading,
    handleAddJobTitle,
    handleRemoveJobTitle,
    handleAddLocation,
    handleRemoveLocation,
    handleYearsExperienceChange,
  };
};
