
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
  apply_url?: string;
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
  const [searchLimits, setSearchLimits] = useState({ searches_used: 0, max_searches: 2, subscription_active: false });

  useEffect(() => {
    if (user) {
      loadJobPreferences();
      loadSearchLimits();
    }
  }, [user]);

  const loadSearchLimits = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('user_search_limits')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading search limits:', error);
        return;
      }

      if (data) {
        setSearchLimits({
          searches_used: data.searches_used || 0,
          max_searches: data.max_searches || 2,
          subscription_active: data.subscription_active || false
        });
      }
    } catch (error) {
      console.error('Error loading search limits:', error);
    }
  };

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

  const checkSearchLimit = async () => {
    // If user has active subscription, allow unlimited searches
    if (searchLimits.subscription_active) {
      return true;
    }

    // Check if user has exceeded free search limit
    if (searchLimits.searches_used >= searchLimits.max_searches) {
      toast({
        title: "Search limit reached",
        description: "You've used all your free searches. Upgrade to Premium for unlimited job searches!",
        variant: "destructive",
      });
      
      // Navigate to upgrade page
      navigate('/upgrade');
      return false;
    }

    return true;
  };

  const updateSearchCount = async () => {
    if (!user || searchLimits.subscription_active) return;

    try {
      const { error } = await supabase
        .from('user_search_limits')
        .update({ 
          searches_used: searchLimits.searches_used + 1,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (error) {
        console.error('Error updating search count:', error);
      } else {
        setSearchLimits(prev => ({ ...prev, searches_used: prev.searches_used + 1 }));
      }
    } catch (error) {
      console.error('Error updating search count:', error);
    }
  };

  const searchJobs = async () => {
    // Check search limits first
    const canSearch = await checkSearchLimit();
    if (!canSearch) return;

    try {
      console.log('Searching for jobs with preferences:', profileData);
      
      const { data, error } = await supabase.functions.invoke('enhanced-job-search', {
        body: profileData
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }

      console.log('Job search response:', data);
      
      if (data?.jobs) {
        // Update search count
        await updateSearchCount();
        
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

      // After saving successfully, run the enhanced AI job search
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

  const remainingSearches = Math.max(0, searchLimits.max_searches - searchLimits.searches_used);
  const buttonText = searchLimits.subscription_active 
    ? (isSaving ? 'Saving & Searching...' : 'Complete Profile & Find Jobs')
    : (isSaving ? 'Saving & Searching...' : `Find Jobs (${remainingSearches} searches left)`);

  return (
    <div className="space-y-6">
      {!searchLimits.subscription_active && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            Free users get {searchLimits.max_searches} job searches. You have {remainingSearches} searches remaining.
            {remainingSearches === 0 && (
              <span className="font-semibold"> Upgrade to Premium for unlimited searches!</span>
            )}
          </p>
        </div>
      )}

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
        buttonText={buttonText}
      />
    </div>
  );
};

export default ProfileForm;
