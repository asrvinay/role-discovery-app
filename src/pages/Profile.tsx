
import React from 'react';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileForm from '@/components/profile/ProfileForm';

const Profile = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <ProfileHeader />
        <ProfileForm />
      </div>
    </div>
  );
};

export default Profile;
