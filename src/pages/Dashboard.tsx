
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Search, Bookmark, User, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [savedJobs, setSavedJobs] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);

  useEffect(() => {
    // Load saved jobs and recent searches from localStorage
    const saved = JSON.parse(localStorage.getItem(`saved_jobs_${user?.id}`) || '[]');
    const searches = JSON.parse(localStorage.getItem(`recent_searches_${user?.id}`) || '[]');
    setSavedJobs(saved);
    setRecentSearches(searches);
  }, [user?.id]);

  return (
    <div className="min-h-screen bg-gray-50 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name}!
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
                  <p className="text-sm font-medium text-gray-600">Recent Searches</p>
                  <p className="text-2xl font-bold text-gray-900">{recentSearches.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Bookmark className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Saved Jobs</p>
                  <p className="text-2xl font-bold text-gray-900">{savedJobs.length}</p>
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
                    {user?.profile ? 'Complete' : 'Incomplete'}
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
              <Link to="/search" className="block">
                <Button className="w-full justify-start" variant="outline">
                  <Search className="mr-2 h-4 w-4" />
                  Search for Jobs
                </Button>
              </Link>
              <Link to="/profile" className="block">
                <Button className="w-full justify-start" variant="outline">
                  <User className="mr-2 h-4 w-4" />
                  {user?.profile ? 'Update Profile' : 'Complete Profile'}
                </Button>
              </Link>
              <Link to="/saved" className="block">
                <Button className="w-full justify-start" variant="outline">
                  <Bookmark className="mr-2 h-4 w-4" />
                  View Saved Jobs
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Profile Status</CardTitle>
            </CardHeader>
            <CardContent>
              {user?.profile ? (
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Job Titles:</span>
                    <span className="text-sm font-medium">
                      {user.profile.jobTitles?.length || 0} selected
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Skills:</span>
                    <span className="text-sm font-medium">
                      {user.profile.skills?.length || 0} added
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Locations:</span>
                    <span className="text-sm font-medium">
                      {user.profile.locations?.length || 0} preferred
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
