
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AddItemSection from './AddItemSection';

interface JobPreferencesSectionProps {
  jobTitles: string[];
  locations: string[];
  yearsExperience: number;
  onAddJobTitle: (value: string) => void;
  onRemoveJobTitle: (index: number) => void;
  onAddLocation: (value: string) => void;
  onRemoveLocation: (index: number) => void;
  onYearsExperienceChange: (value: number) => void;
  inputType: 'jobTitle' | 'location' | 'skill' | 'industry' | null;
  setInputType: (type: 'jobTitle' | 'location' | 'skill' | 'industry' | null) => void;
  currentInput: string;
  setCurrentInput: (value: string) => void;
}

const JobPreferencesSection: React.FC<JobPreferencesSectionProps> = ({
  jobTitles,
  locations,
  yearsExperience,
  onAddJobTitle,
  onRemoveJobTitle,
  onAddLocation,
  onRemoveLocation,
  onYearsExperienceChange,
  inputType,
  setInputType,
  currentInput,
  setCurrentInput
}) => {
  const handleJobTitleSubmit = () => {
    onAddJobTitle(currentInput);
    setCurrentInput('');
    setInputType(null);
  };

  const handleLocationSubmit = () => {
    onAddLocation(currentInput);
    setCurrentInput('');
    setInputType(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Job Preferences</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <AddItemSection
          label="Add Job Title"
          items={jobTitles}
          onAddItem={onAddJobTitle}
          onRemoveItem={onRemoveJobTitle}
          placeholder="Enter job title"
          isInputActive={inputType === 'jobTitle'}
          onToggleInput={() => setInputType('jobTitle')}
          currentInput={currentInput}
          onInputChange={setCurrentInput}
          onInputSubmit={handleJobTitleSubmit}
        />

        <AddItemSection
          label="Add Location"
          items={locations}
          onAddItem={onAddLocation}
          onRemoveItem={onRemoveLocation}
          placeholder="Enter location"
          isInputActive={inputType === 'location'}
          onToggleInput={() => setInputType('location')}
          currentInput={currentInput}
          onInputChange={setCurrentInput}
          onInputSubmit={handleLocationSubmit}
        />

        <div>
          <Label htmlFor="experience">Years of Experience</Label>
          <Input
            id="experience"
            type="number"
            value={yearsExperience}
            onChange={(e) => onYearsExperienceChange(Number(e.target.value))}
            className="mt-2"
            min="0"
            max="50"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default JobPreferencesSection;
