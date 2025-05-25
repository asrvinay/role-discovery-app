import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import JobPreferencesSection from '@/components/profile/JobPreferencesSection';
import SkillsExpertiseSection from '@/components/profile/SkillsExpertiseSection';
import EmploymentPreferencesSection from '@/components/profile/EmploymentPreferencesSection';

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [jobTitles, setJobTitles] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [yearsExperience, setYearsExperience] = useState(0);
  const [skills, setSkills] = useState<string[]>([]);
  const [industries, setIndustries] = useState<string[]>([]);
  const [employmentTypes, setEmploymentTypes] = useState<string[]>([]);
  const [salaryMin, setSalaryMin] = useState(0);
  const [salaryMax, setSalaryMax] = useState(0);
  const [remotePreference, setRemotePreference] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [currentInput, setCurrentInput] = useState('');
  const [inputType, setInputType] = useState<'jobTitle' | 'location' | 'skill' | 'industry' | null>(null);

  // Load existing preferences when component mounts
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
        setJobTitles(data.job_titles || []);
        setLocations(data.locations || []);
        setYearsExperience(data.years_experience || 0);
        setSkills(data.skills || []);
        setIndustries(data.industries || []);
        setEmploymentTypes(data.employment_types || []);
        setSalaryMin(data.salary_min || 0);
        setSalaryMax(data.salary_max || 0);
        setRemotePreference(data.remote_preference || false);
      }
    } catch (error) {
      console.error('Error loading job preferences:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddJobTitle = (value: string) => {
    if (!value.trim()) return;
    setJobTitles([...jobTitles, value]);
  };

  const handleRemoveJobTitle = (index: number) => {
    setJobTitles(jobTitles.filter((_, i) => i !== index));
  };

  const handleAddLocation = (value: string) => {
    if (!value.trim()) return;
    setLocations([...locations, value]);
  };

  const handleRemoveLocation = (index: number) => {
    setLocations(locations.filter((_, i) => i !== index));
  };

  const handleAddSkill = (value: string) => {
    if (!value.trim()) return;
    setSkills([...skills, value]);
  };

  const handleRemoveSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const handleAddIndustry = (value: string) => {
    if (!value.trim()) return;
    setIndustries([...industries, value]);
  };

  const handleRemoveIndustry = (index: number) => {
    setIndustries(industries.filter((_, i) => i !== index));
  };

  const handleEmploymentTypeToggle = (type: string) => {
    if (employmentTypes.includes(type)) {
      setEmploymentTypes(employmentTypes.filter(t => t !== type));
    } else {
      setEmploymentTypes([...employmentTypes, type]);
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

    setIsSaving(true);
    try {
      const preferences = {
        user_id: user.id,
        job_titles: jobTitles,
        locations: locations,
        years_experience: yearsExperience,
        skills: skills,
        industries: industries,
        employment_types: employmentTypes,
        salary_min: salaryMin,
        salary_max: salaryMax,
        remote_preference: remotePreference,
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

      // Redirect to dashboard after successful save
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
      <div className="min-h-screen bg-gray-50 pt-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">Loading your preferences...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Profile</h1>
          <p className="text-gray-600 mt-2">
            Complete your profile to get personalized job recommendations
          </p>
        </div>

        <div className="space-y-6">
          <JobPreferencesSection
            jobTitles={jobTitles}
            locations={locations}
            yearsExperience={yearsExperience}
            onAddJobTitle={handleAddJobTitle}
            onRemoveJobTitle={handleRemoveJobTitle}
            onAddLocation={handleAddLocation}
            onRemoveLocation={handleRemoveLocation}
            onYearsExperienceChange={setYearsExperience}
            inputType={inputType}
            setInputType={setInputType}
            currentInput={currentInput}
            setCurrentInput={setCurrentInput}
          />

          <SkillsExpertiseSection
            skills={skills}
            industries={industries}
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
            employmentTypes={employmentTypes}
            salaryMin={salaryMin}
            salaryMax={salaryMax}
            remotePreference={remotePreference}
            onEmploymentTypeToggle={handleEmploymentTypeToggle}
            onSalaryMinChange={setSalaryMin}
            onSalaryMaxChange={setSalaryMax}
            onRemotePreferenceChange={setRemotePreference}
          />

          <div className="flex justify-end">
            <Button onClick={handleSave} size="lg" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Profile'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
