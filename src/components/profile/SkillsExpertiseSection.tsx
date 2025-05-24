
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AddItemSection from './AddItemSection';

interface SkillsExpertiseSectionProps {
  skills: string[];
  industries: string[];
  onAddSkill: (value: string) => void;
  onRemoveSkill: (index: number) => void;
  onAddIndustry: (value: string) => void;
  onRemoveIndustry: (index: number) => void;
  inputType: 'jobTitle' | 'location' | 'skill' | 'industry' | null;
  setInputType: (type: 'jobTitle' | 'location' | 'skill' | 'industry' | null) => void;
  currentInput: string;
  setCurrentInput: (value: string) => void;
}

const SkillsExpertiseSection: React.FC<SkillsExpertiseSectionProps> = ({
  skills,
  industries,
  onAddSkill,
  onRemoveSkill,
  onAddIndustry,
  onRemoveIndustry,
  inputType,
  setInputType,
  currentInput,
  setCurrentInput
}) => {
  const handleSkillSubmit = () => {
    onAddSkill(currentInput);
    setCurrentInput('');
    setInputType(null);
  };

  const handleIndustrySubmit = () => {
    onAddIndustry(currentInput);
    setCurrentInput('');
    setInputType(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Skills & Expertise</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <AddItemSection
          label="Add Skill"
          items={skills}
          onAddItem={onAddSkill}
          onRemoveItem={onRemoveSkill}
          placeholder="Enter skill"
          isInputActive={inputType === 'skill'}
          onToggleInput={() => setInputType('skill')}
          currentInput={currentInput}
          onInputChange={setCurrentInput}
          onInputSubmit={handleSkillSubmit}
        />

        <AddItemSection
          label="Add Industry"
          items={industries}
          onAddItem={onAddIndustry}
          onRemoveItem={onRemoveIndustry}
          placeholder="Enter industry"
          isInputActive={inputType === 'industry'}
          onToggleInput={() => setInputType('industry')}
          currentInput={currentInput}
          onInputChange={setCurrentInput}
          onInputSubmit={handleIndustrySubmit}
        />
      </CardContent>
    </Card>
  );
};

export default SkillsExpertiseSection;
