
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import JobPreferencesSection from '@/components/profile/JobPreferencesSection';
import SkillsExpertiseSection from '@/components/profile/SkillsExpertiseSection';
import EmploymentPreferencesSection from '@/components/profile/EmploymentPreferencesSection';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [jobTitles, setJobTitles] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [yearsExperience, setYearsExperience] = useState(0);
  const [skills, setSkills] = useState<string[]>([]);
  const [industries, setIndustries] = useState<string[]>([]);
  const [employmentTypes, setEmploymentTypes] = useState<string[]>([]);
  const [salaryMin, setSalaryMin] = useState(0);
  const [salaryMax, setSalaryMax] = useState(0);
  const [remotePreference, setRemotePreference] = useState(false);
  
  const [currentInput, setCurrentInput] = useState('');
  const [inputType, setInputType] = useState<'jobTitle' | 'location' | 'skill' | 'industry' | null>(null);

  // Remove the useEffect that was trying to access user.profile since it doesn't exist
  // The profile data will be loaded when we implement proper profile fetching from Supabase

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

  const handleSave = () => {
    const profile = {
      jobTitles,
      locations,
      yearsExperience,
      skills,
      industries,
      employmentTypes,
      salaryRange: { min: salaryMin, max: salaryMax },
      remotePreference
    };

    updateProfile(profile);
    toast({
      title: "Profile updated!",
      description: "Your profile has been saved successfully.",
    });
  };

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
            <Button onClick={handleSave} size="lg">
              Save Profile
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
