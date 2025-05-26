
import React from 'react';

const ProfileHeader: React.FC = () => {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-gray-900">Your Profile</h1>
      <p className="text-gray-600 mt-2">
        Complete your profile to get personalized job recommendations
      </p>
    </div>
  );
};

export default ProfileHeader;
