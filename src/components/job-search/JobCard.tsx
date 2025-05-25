
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, DollarSign, Building } from 'lucide-react';

interface JobCardProps {
  job: {
    title: string;
    company: string;
    location: string;
    salary?: string;
    description: string;
    source?: string;
  };
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg">{job.title}</CardTitle>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Building className="h-4 w-4" />
            {job.company}
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            {job.location}
          </div>
          {job.salary && (
            <div className="flex items-center gap-1">
              <DollarSign className="h-4 w-4" />
              {job.salary}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 mb-3">{job.description}</p>
        {job.source && (
          <Badge variant="secondary" className="text-xs">
            {job.source}
          </Badge>
        )}
      </CardContent>
    </Card>
  );
};

export default JobCard;
