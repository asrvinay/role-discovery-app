
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { ExternalLink, Trash2, CheckCircle, Clock } from 'lucide-react';

interface SavedJob {
  id: string;
  job_title: string;
  company: string;
  location: string;
  salary?: string;
  description: string;
  apply_url?: string;
  source?: string;
  applied_status: boolean;
  applied_at?: string;
  saved_at: string;
}

const SavedJobs = () => {
  const { user } = useAuth();
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadSavedJobs();
    }
  }, [user]);

  const loadSavedJobs = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('saved_jobs')
        .select('*')
        .eq('user_id', user.id)
        .order('saved_at', { ascending: false });

      if (error) {
        console.error('Error loading saved jobs:', error);
        toast({
          title: "Error",
          description: "Failed to load saved jobs",
          variant: "destructive",
        });
        return;
      }

      setSavedJobs(data || []);
    } catch (error) {
      console.error('Error loading saved jobs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const markAsApplied = async (jobId: string) => {
    try {
      const { error } = await supabase
        .from('saved_jobs')
        .update({ 
          applied_status: true, 
          applied_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', jobId);

      if (error) {
        console.error('Error updating job status:', error);
        toast({
          title: "Error",
          description: "Failed to update job status",
          variant: "destructive",
        });
        return;
      }

      setSavedJobs(prev => prev.map(job => 
        job.id === jobId 
          ? { ...job, applied_status: true, applied_at: new Date().toISOString() }
          : job
      ));

      toast({
        title: "Success",
        description: "Job marked as applied!",
      });
    } catch (error) {
      console.error('Error updating job status:', error);
    }
  };

  const deleteSavedJob = async (jobId: string) => {
    try {
      const { error } = await supabase
        .from('saved_jobs')
        .delete()
        .eq('id', jobId);

      if (error) {
        console.error('Error deleting saved job:', error);
        toast({
          title: "Error",
          description: "Failed to delete saved job",
          variant: "destructive",
        });
        return;
      }

      setSavedJobs(prev => prev.filter(job => job.id !== jobId));

      toast({
        title: "Success",
        description: "Job removed from saved jobs",
      });
    } catch (error) {
      console.error('Error deleting saved job:', error);
    }
  };

  const appliedJobs = savedJobs.filter(job => job.applied_status);
  const pendingJobs = savedJobs.filter(job => !job.applied_status);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please log in to view your saved jobs</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Saved Jobs</h1>
          <p className="text-gray-600 mt-2">
            Manage your saved job opportunities and track applications
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{savedJobs.length}</p>
                <p className="text-sm text-gray-600">Total Saved</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{pendingJobs.length}</p>
                <p className="text-sm text-gray-600">Pending Applications</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{appliedJobs.length}</p>
                <p className="text-sm text-gray-600">Applied</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Loading saved jobs...</p>
          </div>
        ) : savedJobs.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-600 mb-4">No saved jobs yet</p>
              <p className="text-sm text-gray-500">
                Jobs will be automatically saved when you view them in the job search
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {pendingJobs.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Pending Applications ({pendingJobs.length})</h2>
                <div className="grid grid-cols-1 gap-4">
                  {pendingJobs.map((job) => (
                    <Card key={job.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{job.job_title}</CardTitle>
                            <p className="text-sm text-gray-600">{job.company} • {job.location}</p>
                            {job.salary && (
                              <p className="text-sm font-medium text-green-600">{job.salary}</p>
                            )}
                          </div>
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Pending
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-700 mb-4">{job.description}</p>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            {job.source && (
                              <span className="text-xs text-gray-500">{job.source}</span>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => markAsApplied(job.id)}
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Mark Applied
                            </Button>
                            {job.apply_url && (
                              <Button
                                size="sm"
                                onClick={() => window.open(job.apply_url, '_blank')}
                              >
                                Apply <ExternalLink className="h-3 w-3 ml-1" />
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => deleteSavedJob(job.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {appliedJobs.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Applied Jobs ({appliedJobs.length})</h2>
                <div className="grid grid-cols-1 gap-4">
                  {appliedJobs.map((job) => (
                    <Card key={job.id} className="hover:shadow-lg transition-shadow opacity-75">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{job.job_title}</CardTitle>
                            <p className="text-sm text-gray-600">{job.company} • {job.location}</p>
                            {job.salary && (
                              <p className="text-sm font-medium text-green-600">{job.salary}</p>
                            )}
                          </div>
                          <Badge variant="default" className="flex items-center gap-1 bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3" />
                            Applied
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-700 mb-4">{job.description}</p>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            {job.source && (
                              <span className="text-xs text-gray-500">{job.source}</span>
                            )}
                            {job.applied_at && (
                              <span className="text-xs text-gray-500">
                                Applied on {new Date(job.applied_at).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteSavedJob(job.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedJobs;
