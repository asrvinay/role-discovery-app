
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface Job {
  title: string;
  company: string;
  location: string;
  salary?: string;
  description: string;
  apply_url?: string;
  source?: string;
}

interface JobApplicationCardProps {
  job: Job;
  index: number;
  onJobViewed: (index: number) => void;
}

const JobApplicationCard: React.FC<JobApplicationCardProps> = ({ job, index, onJobViewed }) => {
  const { user } = useAuth();

  const saveJobToDatabase = async (job: Job) => {
    if (!user) return;

    try {
      // Check if job is already saved to avoid duplicates
      const { data: existingJob } = await supabase
        .from('saved_jobs')
        .select('id')
        .eq('user_id', user.id)
        .eq('job_title', job.title)
        .eq('company', job.company)
        .eq('location', job.location)
        .maybeSingle();

      if (existingJob) {
        console.log('Job already saved:', job.title);
        return;
      }

      // Save the job
      const { error } = await supabase
        .from('saved_jobs')
        .insert({
          user_id: user.id,
          job_title: job.title,
          company: job.company,
          location: job.location,
          salary: job.salary,
          description: job.description,
          apply_url: job.apply_url,
          source: job.source
        });

      if (error) {
        console.error('Error saving job:', error);
        return;
      }

      console.log('Job saved successfully:', job.title);
      toast({
        title: "Job Saved",
        description: `${job.title} at ${job.company} has been saved to your job list`,
      });
    } catch (error) {
      console.error('Error saving job:', error);
    }
  };

  const handleApplyClick = async () => {
    if (job.apply_url) {
      // Save the job automatically when user clicks apply
      await saveJobToDatabase(job);

      // Track that the user viewed this job
      if (user) {
        try {
          await supabase
            .from('job_views')
            .insert({
              user_id: user.id,
              job_title: job.title,
              company: job.company,
              apply_url: job.apply_url,
              viewed_at: new Date().toISOString()
            });
        } catch (error) {
          console.error('Error tracking job view:', error);
        }
      }

      // Mark this job as viewed in the parent component
      onJobViewed(index);
      
      // Open the application link
      window.open(job.apply_url, '_blank');
    }
  };

  const handleSaveJob = async () => {
    await saveJobToDatabase(job);
    // Mark as viewed when manually saved
    onJobViewed(index);
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg">{job.title}</CardTitle>
        <p className="text-sm text-gray-600">{job.company} • {job.location}</p>
        {job.salary && (
          <p className="text-sm font-medium text-green-600">{job.salary}</p>
        )}
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-700 mb-4">{job.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">{job.source}</span>
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={handleSaveJob}
            >
              Save Job
            </Button>
            {job.apply_url && (
              <Button 
                size="sm" 
                onClick={handleApplyClick}
                className="flex items-center gap-1"
              >
                Apply Now <ExternalLink className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobApplicationCard;
