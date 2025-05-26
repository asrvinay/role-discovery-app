
import React from 'react';

interface Profile {
  id: string;
  name: string;
  email: string;
}

interface DashboardWelcomeProps {
  profile: Profile | null;
  userEmail: string;
}

const DashboardWelcome: React.FC<DashboardWelcomeProps> = ({ profile, userEmail }) => {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-gray-900">
        Welcome back, {profile?.name || userEmail}!
      </h1>
      <p className="text-gray-600 mt-2">
        Here's your job search overview
      </p>
    </div>
  );
};

export default DashboardWelcome;
