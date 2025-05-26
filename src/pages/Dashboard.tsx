
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Search, Bookmark, User, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  id: string;
  name: string;
  email: string;
}

interface DashboardMetrics {
  totalSearches: number;
  savedJobs: number;
  viewedJobs: number;
  profileComplete: boolean;
}

const Dashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalSearches: 0,
    savedJobs: 0,
    viewedJobs: 0,
    profileComplete: false
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      // Load profile
      await fetchProfile();
      
      // Load metrics
      await Promise.all([
        loadJobSearches(),
        loadJobViews(),
        checkProfileComplete()
      ]);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const loadJobSearches = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('job_searches')
        .select('id')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error loading job searches:', error);
        return;
      }

      setMetrics(prev => ({ ...prev, totalSearches: data?.length || 0 }));
    } catch (error) {
      console.error('Error loading job searches:', error);
    }
  };

  const loadJobViews = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('job_views')
        .select('id')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error loading job views:', error);
        return;
      }

      setMetrics(prev => ({ ...prev, viewedJobs: data?.length || 0 }));
    } catch (error) {
      console.error('Error loading job views:', error);
    }
  };

  const checkProfileComplete = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('job_preferences')
        .select('job_titles, locations')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking profile:', error);
        return;
      }

      const isComplete = data && 
        ((data.job_titles && data.job_titles.length > 0) || 
         (data.locations && data.locations.length > 0));

      setMetrics(prev => ({ ...prev, profileComplete: !!isComplete }));
    } catch (error) {
      console.error('Error checking profile:', error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please log in to access your dashboard</h1>
          <Link to="/login">
            <Button>Login</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {profile?.name || user.email}!
          </h1>
          <p className="text-gray-600 mt-2">
            Here's your job search overview
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Search className="h-8 w-8 text-indigo-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Searches</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {isLoading ? '...' : metrics.totalSearches}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Bookmark className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Jobs Viewed</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {isLoading ? '...' : metrics.viewedJobs}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Applications</p>
                  <p className="text-2xl font-bold text-gray-900">0</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center">
                <User className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Profile</p>
                  <p className="text-sm font-bold text-gray-900">
                    {isLoading ? '...' : (metrics.profileComplete ? 'Complete' : 'Incomplete')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link to="/job-recommendations" className="block">
                <Button className="w-full justify-start" variant="outline">
                  <Search className="mr-2 h-4 w-4" />
                  Search for Jobs
                </Button>
              </Link>
              <Link to="/profile" className="block">
                <Button className="w-full justify-start" variant="outline">
                  <User className="mr-2 h-4 w-4" />
                  Complete Profile
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Profile Status</CardTitle>
            </CardHeader>
            <CardContent>
              {profile ? (
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Name:</span>
                    <span className="text-sm font-medium">{profile.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Email:</span>
                    <span className="text-sm font-medium">{profile.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Profile Status:</span>
                    <span className={`text-sm font-medium ${metrics.profileComplete ? 'text-green-600' : 'text-orange-600'}`}>
                      {isLoading ? '...' : (metrics.profileComplete ? 'Complete' : 'Incomplete')}
                    </span>
                  </div>
                  <Link to="/profile">
                    <Button className="w-full mt-4" variant="outline">
                      Update Profile
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-600 mb-4">
                    Complete your profile to get personalized job recommendations
                  </p>
                  <Link to="/profile">
                    <Button>Complete Profile</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
