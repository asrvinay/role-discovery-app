
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface EmploymentPreferencesSectionProps {
  employmentTypes: string[];
  salaryMin: number;
  salaryMax: number;
  remotePreference: boolean;
  onEmploymentTypeToggle: (type: string) => void;
  onSalaryMinChange: (value: number) => void;
  onSalaryMaxChange: (value: number) => void;
  onRemotePreferenceChange: (value: boolean) => void;
}

const EmploymentPreferencesSection: React.FC<EmploymentPreferencesSectionProps> = ({
  employmentTypes,
  salaryMin,
  salaryMax,
  remotePreference,
  onEmploymentTypeToggle,
  onSalaryMinChange,
  onSalaryMaxChange,
  onRemotePreferenceChange
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Employment Preferences</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label>Employment Types</Label>
          <div className="mt-2 flex flex-wrap gap-2">
            {['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship'].map((type) => (
              <Button
                key={type}
                variant={employmentTypes.includes(type) ? "default" : "outline"}
                size="sm"
                onClick={() => onEmploymentTypeToggle(type)}
              >
                {type}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="salaryMin">Minimum Salary ($)</Label>
            <Input
              id="salaryMin"
              type="number"
              value={salaryMin}
              onChange={(e) => onSalaryMinChange(Number(e.target.value))}
              className="mt-2"
              min="0"
            />
          </div>
          <div>
            <Label htmlFor="salaryMax">Maximum Salary ($)</Label>
            <Input
              id="salaryMax"
              type="number"
              value={salaryMax}
              onChange={(e) => onSalaryMaxChange(Number(e.target.value))}
              className="mt-2"
              min="0"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="remote"
            checked={remotePreference}
            onChange={(e) => onRemotePreferenceChange(e.target.checked)}
            className="rounded"
          />
          <Label htmlFor="remote">Open to remote work</Label>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmploymentPreferencesSection;
