
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Search, RefreshCw, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import JobCard from '@/components/job-search/JobCard';

interface Job {
  title: string;
  company: string;
  location: string;
  salary?: string;
  description: string;
  source?: string;
}

interface UserPreferences {
  jobTitles: string[];
  locations: string[];
  skills: string[];
  industries: string[];
  employmentTypes: string[];
  salaryMin: number;
  salaryMax: number;
  remotePreference: boolean;
}

const JobRecommendations = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null);
  const [isLoadingPreferences, setIsLoadingPreferences] = useState(true);

  // Load user preferences when component mounts
  useEffect(() => {
    if (user) {
      loadUserPreferences();
    }
  }, [user]);

  const loadUserPreferences = async () => {
    if (!user) return;
    
    setIsLoadingPreferences(true);
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
        setUserPreferences({
          jobTitles: data.job_titles || [],
          locations: data.locations || [],
          skills: data.skills || [],
          industries: data.industries || [],
          employmentTypes: data.employment_types || [],
          salaryMin: data.salary_min || 0,
          salaryMax: data.salary_max || 0,
          remotePreference: data.remote_preference || false
        });
      } else {
        // No preferences found, set default values
        setUserPreferences({
          jobTitles: [],
          locations: [],
          skills: [],
          industries: [],
          employmentTypes: [],
          salaryMin: 0,
          salaryMax: 0,
          remotePreference: false
        });
      }
    } catch (error) {
      console.error('Error loading job preferences:', error);
    } finally {
      setIsLoadingPreferences(false);
    }
  };

  const searchJobs = async () => {
    if (!userPreferences) {
      toast({
        title: "No preferences found",
        description: "Please complete your profile first to get personalized recommendations.",
        variant: "destructive",
      });
      return;
    }

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

  if (isLoadingPreferences) {
    return (
      <div className="min-h-screen bg-gray-50 pt-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">Loading your preferences...</div>
        </div>
      </div>
    );
  }

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
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Your Search Preferences
            </CardTitle>
          </CardHeader>
          <CardContent>
            {userPreferences && (
              userPreferences.jobTitles.length > 0 || 
              userPreferences.locations.length > 0 || 
              userPreferences.skills.length > 0
            ) ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                {userPreferences.jobTitles.length > 0 && (
                  <div>
                    <strong>Job Titles:</strong> {userPreferences.jobTitles.join(', ')}
                  </div>
                )}
                {userPreferences.locations.length > 0 && (
                  <div>
                    <strong>Locations:</strong> {userPreferences.locations.join(', ')}
                  </div>
                )}
                {userPreferences.skills.length > 0 && (
                  <div>
                    <strong>Skills:</strong> {userPreferences.skills.join(', ')}
                  </div>
                )}
                {userPreferences.industries.length > 0 && (
                  <div>
                    <strong>Industries:</strong> {userPreferences.industries.join(', ')}
                  </div>
                )}
                {userPreferences.employmentTypes.length > 0 && (
                  <div>
                    <strong>Employment:</strong> {userPreferences.employmentTypes.join(', ')}
                  </div>
                )}
                {userPreferences.salaryMin > 0 && userPreferences.salaryMax > 0 && (
                  <div>
                    <strong>Salary:</strong> ${userPreferences.salaryMin.toLocaleString()} - ${userPreferences.salaryMax.toLocaleString()}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-600 mb-4">
                  No job preferences found. Complete your profile to get personalized recommendations.
                </p>
                <Button variant="outline" onClick={() => window.location.href = '/profile'}>
                  Complete Profile
                </Button>
              </div>
            )}
            
            {userPreferences && (
              userPreferences.jobTitles.length > 0 || 
              userPreferences.locations.length > 0 || 
              userPreferences.skills.length > 0
            ) && (
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
            )}
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
                    No jobs found matching your criteria. Try updating your preferences and search again.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {!hasSearched && userPreferences && (
          userPreferences.jobTitles.length === 0 && 
          userPreferences.locations.length === 0 && 
          userPreferences.skills.length === 0
        ) && (
          <Card>
            <CardContent className="text-center py-12">
              <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Complete Your Profile First</h3>
              <p className="text-gray-600 mb-4">
                Add your job preferences to get personalized AI-powered job recommendations.
              </p>
              <Button onClick={() => window.location.href = '/profile'}>
                Complete Profile
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default JobRecommendations;
