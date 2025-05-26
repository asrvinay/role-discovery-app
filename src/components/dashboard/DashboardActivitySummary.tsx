
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DashboardMetrics {
  totalSearches: number;
  savedJobs: number;
  viewedJobs: number;
  appliedJobs: number;
  profileComplete: boolean;
}

interface DashboardActivitySummaryProps {
  metrics: DashboardMetrics;
  isLoading: boolean;
}

const DashboardActivitySummary: React.FC<DashboardActivitySummaryProps> = ({ metrics, isLoading }) => {
  const activities = [
    {
      label: 'Total Searches:',
      value: metrics.totalSearches
    },
    {
      label: 'Jobs Saved:',
      value: metrics.savedJobs
    },
    {
      label: 'Applications:',
      value: metrics.appliedJobs
    },
    {
      label: 'Profile Status:',
      value: metrics.profileComplete ? 'Complete' : 'Incomplete',
      isStatus: true
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Job Search Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {activities.map((activity) => (
            <div key={activity.label} className="flex justify-between">
              <span className="text-sm text-gray-600">{activity.label}</span>
              <span className={`text-sm font-medium ${
                activity.isStatus 
                  ? (metrics.profileComplete ? 'text-green-600' : 'text-orange-600')
                  : ''
              }`}>
                {isLoading ? '...' : activity.value}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardActivitySummary;
