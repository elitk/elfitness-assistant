import React from 'react';
import Image from 'next/image';

interface ProfileProps {
  name: string;
  goalMessage: string;
  avatarUrl: string;
}

const Profile = ({ name, goalMessage, avatarUrl }: ProfileProps) => {
  return (
    <div className="bg-[#121417] py-4 px-6 flex items-center">
      <div className="mr-6">
        <div className="w-24 h-24 rounded-full overflow-hidden">
          <Image 
            src={avatarUrl} 
            alt={`${name}'s profile`} 
            width={96} 
            height={96}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      
      <div>
        <h1 className="text-white text-xl font-bold mb-1">Hi, {name}</h1>
        <p className="text-gray-400">{goalMessage}</p>
      </div>
    </div>
  );
};

export default Profile;