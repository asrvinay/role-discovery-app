
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Search, RefreshCw, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import JobApplicationCard from '@/components/job-search/JobApplicationCard';

interface Job {
  title: string;
  company: string;
  location: string;
  salary?: string;
  description: string;
  apply_url?: string;
  source?: string;
}

interface UserPreferences {
  jobTitles: string[];
  locations: string[];
}

interface SearchLimits {
  searches_used: number;
  max_searches: number;
  subscription_active: boolean;
}

const JobRecommendations = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [viewedJobs, setViewedJobs] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null);
  const [isLoadingPreferences, setIsLoadingPreferences] = useState(true);
  const [searchLimits, setSearchLimits] = useState<SearchLimits>({ 
    searches_used: 0, 
    max_searches: 2, 
    subscription_active: false 
  });

  useEffect(() => {
    if (user) {
      loadUserPreferences();
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

  const loadUserPreferences = async () => {
    if (!user) return;
    
    setIsLoadingPreferences(true);
    try {
      const { data, error } = await supabase
        .from('job_preferences')
        .select('job_titles, locations')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading job preferences:', error);
        return;
      }

      if (data) {
        setUserPreferences({
          jobTitles: data.job_titles || [],
          locations: data.locations || []
        });
      } else {
        setUserPreferences({
          jobTitles: [],
          locations: []
        });
      }
    } catch (error) {
      console.error('Error loading job preferences:', error);
    } finally {
      setIsLoadingPreferences(false);
    }
  };

  const checkSearchLimit = () => {
    if (searchLimits.subscription_active) {
      return true;
    }

    if (searchLimits.searches_used >= searchLimits.max_searches) {
      toast({
        title: "Search limit reached",
        description: "You've used all your free searches. Upgrade to Premium for unlimited job searches!",
        variant: "destructive",
      });
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
    if (!userPreferences) {
      toast({
        title: "No preferences found",
        description: "Please complete your profile first to get personalized recommendations.",
        variant: "destructive",
      });
      return;
    }

    // Check search limits
    if (!checkSearchLimit()) {
      return;
    }

    setIsLoading(true);
    try {
      console.log('Searching for jobs with preferences:', userPreferences);
      
      const { data, error } = await supabase.functions.invoke('enhanced-job-search', {
        body: userPreferences
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }

      console.log('Enhanced job search response:', data);
      
      if (data?.jobs) {
        setJobs(data.jobs);
        setHasSearched(true);
        setViewedJobs(new Set()); // Reset viewed jobs
        
        // Update search count
        await updateSearchCount();
        
        toast({
          title: "Jobs found!",
          description: `Found ${data.jobs.length} job recommendations with application links.`,
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

  const handleJobViewed = (index: number) => {
    setViewedJobs(prev => new Set([...prev, index]));
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

  const remainingSearches = Math.max(0, searchLimits.max_searches - searchLimits.searches_used);
  const unviewedJobs = jobs.filter((_, index) => !viewedJobs.has(index));

  return (
    <div className="min-h-screen bg-gray-50 pt-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">AI Job Recommendations</h1>
          <p className="text-gray-600 mt-2">
            Get personalized job recommendations with direct application links
          </p>
        </div>

        {!searchLimits.subscription_active && (
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              Free users get {searchLimits.max_searches} job searches. You have <strong>{remainingSearches}</strong> searches remaining.
              {remainingSearches === 0 && (
                <span className="font-semibold"> Upgrade to Premium for unlimited searches!</span>
              )}
            </p>
            {remainingSearches === 0 && (
              <Button 
                className="mt-2" 
                size="sm"
                onClick={() => window.location.href = '/upgrade'}
              >
                Upgrade Now
              </Button>
            )}
          </div>
        )}

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
              userPreferences.locations.length > 0
            ) ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
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
              userPreferences.locations.length > 0
            ) && (
              <div className="mt-4 flex gap-2">
                <Button 
                  onClick={searchJobs} 
                  disabled={isLoading || (!searchLimits.subscription_active && remainingSearches === 0)}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Search className="h-4 w-4 mr-2" />
                  )}
                  {!searchLimits.subscription_active && remainingSearches === 0 
                    ? 'Upgrade for More Searches'
                    : hasSearched ? 'Search Again' : 'Find Jobs with AI'
                  }
                  {!searchLimits.subscription_active && remainingSearches > 0 && (
                    ` (${remainingSearches} left)`
                  )}
                </Button>
                {hasSearched && remainingSearches > 0 && (
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
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">
                {unviewedJobs.length > 0 ? `${unviewedJobs.length} Jobs Available` : 'All Jobs Viewed'}
              </h2>
              {jobs.length > 0 && viewedJobs.size > 0 && (
                <p className="text-sm text-gray-600">
                  {viewedJobs.size} of {jobs.length} jobs viewed
                </p>
              )}
            </div>
            
            {unviewedJobs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {jobs.map((job, index) => {
                  if (viewedJobs.has(index)) return null;
                  return (
                    <JobApplicationCard
                      key={index}
                      job={job}
                      index={index}
                      onJobViewed={handleJobViewed}
                    />
                  );
                })}
              </div>
            ) : jobs.length > 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-gray-600 mb-4">
                    You've viewed all available jobs! Search again to find new opportunities.
                  </p>
                  <Button onClick={searchJobs} disabled={isLoading || (!searchLimits.subscription_active && remainingSearches === 0)}>
                    Search for More Jobs
                  </Button>
                </CardContent>
              </Card>
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
      </div>
    </div>
  );
};

export default JobRecommendations;
