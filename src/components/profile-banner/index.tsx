import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getProfile } from '@/lib/api/profile';
import { Profile } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

interface ProfileBannerProps {
  className?: string;
}

const ProfileBanner = ({ className = '' }: ProfileBannerProps) => {
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    async function loadProfile() {
      if (!user) return;
      
      setLoading(true);
      const { data, error } = await getProfile();
      if (error) console.error('Error loading profile:', error);
      else setProfile(data);
      setLoading(false);
    }
    
    if (!authLoading) {
      loadProfile();
    }
  }, [user, authLoading]);

  if (authLoading || loading) {
    return <div className={`bg-[#121417] py-4 px-6 ${className}`}>Loading profile...</div>;
  }
  
  if (!profile) {
    return <div className={`bg-[#121417] py-4 px-6 ${className}`}>No profile found</div>;
  }

  // Calculate goal message
  const goalDate = profile.goal_date ? new Date(profile.goal_date) : null;
  const goalDateStr = goalDate ? goalDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '';
  const goalMessage = profile.fitness_goal && profile.goal_target && goalDateStr
    ? `Welcome back! You're on track to achieve your goal of ${profile.fitness_goal} ${profile.goal_target} lbs by ${goalDateStr}`
    : 'Welcome back!';

  return (
    <div className={`bg-[#121417] py-4 px-6 flex items-center ${className}`}>
      <div className="mr-6">
        <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-700">
          {profile.avatar_url ? (
            <Image 
              src={profile.avatar_url} 
              alt={`${profile.name}'s profile`} 
              width={96} 
              height={96}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-2xl text-white">
              {profile.name?.[0] || '?'}
            </div>
          )}
        </div>
      </div>
      
      <div>
        <h1 className="text-white text-3xl font-bold mb-1">
          Hi, {profile.name || 'there'}
        </h1>
        <p className="text-gray-400">{goalMessage}</p>
      </div>
    </div>
  );
};

export default ProfileBanner;