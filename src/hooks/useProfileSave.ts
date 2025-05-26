
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ProfileData } from '@/types/profile';

export const useProfileSave = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (profileData: ProfileData) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to save preferences.",
        variant: "destructive",
      });
      return;
    }

    // Simplified validation - just need at least one job title OR location
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

      toast({
        title: "Profile saved!",
        description: "Redirecting to job search...",
      });

      // Immediately redirect to job search after saving
      navigate('/job-recommendations');
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

  return {
    handleSave,
    isSaving,
  };
};
