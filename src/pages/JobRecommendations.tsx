
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Search, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import JobCard from '@/components/job-search/JobCard';

interface Job {
  title: string;
  company: string;
  location: string;
  salary?: string;
  description: string;
  source?: string;
}

const JobRecommendations = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Mock user preferences for demonstration
  const [userPreferences] = useState({
    jobTitles: ['Software Engineer', 'Frontend Developer'],
    locations: ['San Francisco', 'Remote'],
    skills: ['React', 'TypeScript', 'JavaScript'],
    industries: ['Technology', 'Startup'],
    employmentTypes: ['Full-time'],
    salaryMin: 80000,
    salaryMax: 150000,
    remotePreference: true
  });

  const searchJobs = async () => {
    setIsLoading(true);
    try {
      console.log('Searching for jobs with preferences:', userPreferences);
      
      const { data, error } = await supabase.functions.invoke('ai-job-search', {
        body: userPreferences
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }

      console.log('Job search response:', data);
      
      if (data?.jobs) {
        setJobs(data.jobs);
        setHasSearched(true);
        toast({
          title: "Jobs found!",
          description: `Found ${data.jobs.length} job recommendations for you.`,
        });
      } else {
        throw new Error('No jobs found in response');
      }
    } catch (error) {
      console.error('Error searching for jobs:', error);
      toast({
        title: "Search failed",
        description: "Unable to search for jobs. Please try again.",
        variant: "destructive",
      });
      setJobs([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">AI Job Recommendations</h1>
          <p className="text-gray-600 mt-2">
            Get personalized job recommendations powered by AI web search
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Your Search Preferences</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              <div>
                <strong>Job Titles:</strong> {userPreferences.jobTitles.join(', ')}
              </div>
              <div>
                <strong>Locations:</strong> {userPreferences.locations.join(', ')}
              </div>
              <div>
                <strong>Skills:</strong> {userPreferences.skills.join(', ')}
              </div>
              <div>
                <strong>Industries:</strong> {userPreferences.industries.join(', ')}
              </div>
              <div>
                <strong>Employment:</strong> {userPreferences.employmentTypes.join(', ')}
              </div>
              <div>
                <strong>Salary:</strong> ${userPreferences.salaryMin.toLocaleString()} - ${userPreferences.salaryMax.toLocaleString()}
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button onClick={searchJobs} disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Search className="h-4 w-4 mr-2" />
                )}
                {hasSearched ? 'Search Again' : 'Find Jobs with AI'}
              </Button>
              {hasSearched && (
                <Button variant="outline" onClick={searchJobs} disabled={isLoading}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Results
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {hasSearched && (
          <div>
            <h2 className="text-2xl font-semibold mb-6">
              {jobs.length > 0 ? `Found ${jobs.length} Job Recommendations` : 'No Jobs Found'}
            </h2>
            {jobs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {jobs.map((job, index) => (
                  <JobCard key={index} job={job} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-gray-600">
                    No jobs found matching your criteria. Try adjusting your preferences and search again.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {!hasSearched && (
          <Card>
            <CardContent className="text-center py-12">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Ready to Find Your Dream Job?</h3>
              <p className="text-gray-600 mb-4">
                Click "Find Jobs with AI" to get personalized recommendations based on your preferences.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default JobRecommendations;
