
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { X, Plus } from 'lucide-react';

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

  const handleAddItem = (type: string, value: string) => {
    if (!value.trim()) return;

    switch (type) {
      case 'jobTitle':
        setJobTitles([...jobTitles, value]);
        break;
      case 'location':
        setLocations([...locations, value]);
        break;
      case 'skill':
        setSkills([...skills, value]);
        break;
      case 'industry':
        setIndustries([...industries, value]);
        break;
    }
    setCurrentInput('');
    setInputType(null);
  };

  const handleRemoveItem = (type: string, index: number) => {
    switch (type) {
      case 'jobTitle':
        setJobTitles(jobTitles.filter((_, i) => i !== index));
        break;
      case 'location':
        setLocations(locations.filter((_, i) => i !== index));
        break;
      case 'skill':
        setSkills(skills.filter((_, i) => i !== index));
        break;
      case 'industry':
        setIndustries(industries.filter((_, i) => i !== index));
        break;
    }
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
          <Card>
            <CardHeader>
              <CardTitle>Job Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Job Titles / Roles</Label>
                <div className="mt-2">
                  <div className="flex flex-wrap gap-2 mb-2">
                    {jobTitles.map((title, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {title}
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => handleRemoveItem('jobTitle', index)}
                        />
                      </Badge>
                    ))}
                  </div>
                  {inputType === 'jobTitle' ? (
                    <div className="flex gap-2">
                      <Input
                        value={currentInput}
                        onChange={(e) => setCurrentInput(e.target.value)}
                        placeholder="Enter job title"
                        onKeyPress={(e) => e.key === 'Enter' && handleAddItem('jobTitle', currentInput)}
                      />
                      <Button onClick={() => handleAddItem('jobTitle', currentInput)}>Add</Button>
                    </div>
                  ) : (
                    <Button variant="outline" onClick={() => setInputType('jobTitle')}>
                      <Plus className="h-4 w-4 mr-1" /> Add Job Title
                    </Button>
                  )}
                </div>
              </div>

              <div>
                <Label>Preferred Locations</Label>
                <div className="mt-2">
                  <div className="flex flex-wrap gap-2 mb-2">
                    {locations.map((location, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {location}
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => handleRemoveItem('location', index)}
                        />
                      </Badge>
                    ))}
                  </div>
                  {inputType === 'location' ? (
                    <div className="flex gap-2">
                      <Input
                        value={currentInput}
                        onChange={(e) => setCurrentInput(e.target.value)}
                        placeholder="Enter location"
                        onKeyPress={(e) => e.key === 'Enter' && handleAddItem('location', currentInput)}
                      />
                      <Button onClick={() => handleAddItem('location', currentInput)}>Add</Button>
                    </div>
                  ) : (
                    <Button variant="outline" onClick={() => setInputType('location')}>
                      <Plus className="h-4 w-4 mr-1" /> Add Location
                    </Button>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="experience">Years of Experience</Label>
                <Input
                  id="experience"
                  type="number"
                  value={yearsExperience}
                  onChange={(e) => setYearsExperience(Number(e.target.value))}
                  className="mt-2"
                  min="0"
                  max="50"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Skills & Expertise</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Skills & Technologies</Label>
                <div className="mt-2">
                  <div className="flex flex-wrap gap-2 mb-2">
                    {skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {skill}
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => handleRemoveItem('skill', index)}
                        />
                      </Badge>
                    ))}
                  </div>
                  {inputType === 'skill' ? (
                    <div className="flex gap-2">
                      <Input
                        value={currentInput}
                        onChange={(e) => setCurrentInput(e.target.value)}
                        placeholder="Enter skill"
                        onKeyPress={(e) => e.key === 'Enter' && handleAddItem('skill', currentInput)}
                      />
                      <Button onClick={() => handleAddItem('skill', currentInput)}>Add</Button>
                    </div>
                  ) : (
                    <Button variant="outline" onClick={() => setInputType('skill')}>
                      <Plus className="h-4 w-4 mr-1" /> Add Skill
                    </Button>
                  )}
                </div>
              </div>

              <div>
                <Label>Industries</Label>
                <div className="mt-2">
                  <div className="flex flex-wrap gap-2 mb-2">
                    {industries.map((industry, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {industry}
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => handleRemoveItem('industry', index)}
                        />
                      </Badge>
                    ))}
                  </div>
                  {inputType === 'industry' ? (
                    <div className="flex gap-2">
                      <Input
                        value={currentInput}
                        onChange={(e) => setCurrentInput(e.target.value)}
                        placeholder="Enter industry"
                        onKeyPress={(e) => e.key === 'Enter' && handleAddItem('industry', currentInput)}
                      />
                      <Button onClick={() => handleAddItem('industry', currentInput)}>Add</Button>
                    </div>
                  ) : (
                    <Button variant="outline" onClick={() => setInputType('industry')}>
                      <Plus className="h-4 w-4 mr-1" /> Add Industry
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

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
                      onClick={() => handleEmploymentTypeToggle(type)}
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
                    onChange={(e) => setSalaryMin(Number(e.target.value))}
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
                    onChange={(e) => setSalaryMax(Number(e.target.value))}
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
                  onChange={(e) => setRemotePreference(e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="remote">Open to remote work</Label>
              </div>
            </CardContent>
          </Card>

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
