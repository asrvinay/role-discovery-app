
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Bookmark, User, TrendingUp, FileText } from 'lucide-react';

interface DashboardMetricsData {
  totalSearches: number;
  savedJobs: number;
  viewedJobs: number;
  appliedJobs: number;
  profileComplete: boolean;
}

interface DashboardMetricsProps {
  metrics: DashboardMetricsData;
  isLoading: boolean;
}

const DashboardMetrics: React.FC<DashboardMetricsProps> = ({ metrics, isLoading }) => {
  const metricCards = [
    {
      title: 'Total Searches',
      value: metrics.totalSearches,
      icon: Search,
      color: 'text-indigo-600'
    },
    {
      title: 'Jobs Viewed',
      value: metrics.viewedJobs,
      icon: Bookmark,
      color: 'text-green-600'
    },
    {
      title: 'Saved Jobs',
      value: metrics.savedJobs,
      icon: FileText,
      color: 'text-blue-600'
    },
    {
      title: 'Applications',
      value: metrics.appliedJobs,
      icon: TrendingUp,
      color: 'text-purple-600'
    },
    {
      title: 'Profile',
      value: metrics.profileComplete ? 'Complete' : 'Incomplete',
      icon: User,
      color: 'text-orange-600',
      isText: true
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
      {metricCards.map((card) => (
        <Card key={card.title} className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center">
              <card.icon className={`h-8 w-8 ${card.color}`} />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className={card.isText ? "text-sm font-bold text-gray-900" : "text-2xl font-bold text-gray-900"}>
                  {isLoading ? '...' : card.value}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DashboardMetrics;
