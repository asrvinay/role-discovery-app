
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import DashboardWelcome from '@/components/dashboard/DashboardWelcome';
import DashboardMetrics from '@/components/dashboard/DashboardMetrics';
import DashboardQuickActions from '@/components/dashboard/DashboardQuickActions';
import DashboardActivitySummary from '@/components/dashboard/DashboardActivitySummary';

interface Profile {
  id: string;
  name: string;
  email: string;
}

interface DashboardMetricsData {
  totalSearches: number;
  savedJobs: number;
  viewedJobs: number;
  appliedJobs: number;
  profileComplete: boolean;
}

const Dashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [metrics, setMetrics] = useState<DashboardMetricsData>({
    totalSearches: 0,
    savedJobs: 0,
    viewedJobs: 0,
    appliedJobs: 0,
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
        loadSavedJobs(),
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

  const loadSavedJobs = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('saved_jobs')
        .select('id, applied_status')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error loading saved jobs:', error);
        return;
      }

      const savedJobsCount = data?.length || 0;
      const appliedJobsCount = data?.filter(job => job.applied_status).length || 0;

      setMetrics(prev => ({ 
        ...prev, 
        savedJobs: savedJobsCount,
        appliedJobs: appliedJobsCount
      }));
    } catch (error) {
      console.error('Error loading saved jobs:', error);
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
        <DashboardWelcome profile={profile} userEmail={user.email || ''} />
        
        <DashboardMetrics metrics={metrics} isLoading={isLoading} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <DashboardQuickActions />
          <DashboardActivitySummary metrics={metrics} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
