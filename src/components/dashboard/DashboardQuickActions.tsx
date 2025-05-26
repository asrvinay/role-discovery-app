
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, Bookmark, User } from 'lucide-react';

const DashboardQuickActions: React.FC = () => {
  const actions = [
    {
      to: '/job-recommendations',
      icon: Search,
      label: 'Search for Jobs'
    },
    {
      to: '/saved',
      icon: Bookmark,
      label: 'View Saved Jobs'
    },
    {
      to: '/profile',
      icon: User,
      label: 'Complete Profile'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {actions.map((action) => (
          <Link key={action.to} to={action.to} className="block">
            <Button className="w-full justify-start" variant="outline">
              <action.icon className="mr-2 h-4 w-4" />
              {action.label}
            </Button>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
};

export default DashboardQuickActions;
