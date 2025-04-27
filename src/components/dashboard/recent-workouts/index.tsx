import React from 'react';
import Link from 'next/link';

interface WorkoutProps {
  id: string;
  title: string;
  duration: number;
  calories: number;
  date: string;
}

const WorkoutItem: React.FC<WorkoutProps> = ({ id, title, duration, calories, date }) => {
  return (
    <div key={id} className="flex justify-between items-center py-4 border-b border-gray-800">
      <div>
        <h3 className="text-white font-medium text-lg">{title}</h3>
        <div className="text-gray-400 text-sm mt-1">
          {duration} min
        </div>
        <div className="text-gray-400 text-sm">
          {calories} cal
        </div>
      </div>
      <div className="text-gray-300">
        {date}
      </div>
    </div>
  );
};
interface RecentWorkoutsProps {
    workouts: WorkoutProps[];
  }

const RecentWorkouts: React.FC<RecentWorkoutsProps> = ({ workouts }) => {
 
  return (
    <div className="bg-[#121417] rounded-xl p-6">
      <h2 className="text-white text-2xl font-bold mb-6">Recent workouts</h2>
      
      <div className="space-y-1">
        {workouts.map((workout, index) => (
          <WorkoutItem
            key={index}
            id={workout.id}
            title={workout.title}
            duration={workout.duration}
            calories={workout.calories}
            date={workout.date}
          />
        ))}
      </div>
      
      <div className="mt-6">
        <Link 
          href="/coach"
          className="inline-block bg-[#0D69F2] text-white font-medium px-6 py-3 rounded-full"
        >
          Talk to Coach
        </Link>
      </div>
    </div>
  );
};

export default RecentWorkouts;