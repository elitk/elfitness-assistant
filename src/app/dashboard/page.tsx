"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import StatsSummary from "@/components/dashboard/stats-summary";
import RecentWorkouts from "@/components/dashboard/recent-workouts";
import ProgressBar from "@/components/progress-bar";
import Profile from "@/components/profile";

const mockUserStats = {
  weight: 78, // kg
  bmi: 24.2,
  streak: 5, // days
};

const mockRecentWorkouts = [
  {
    id: "1",
    title: "Full Body HIIT",
    duration: 20,
    calories: 150,
    date: "Today",
  },
  {
    id: "2",
    title: "Lower Body Strength",
    duration: 15,
    calories: 120,
    date: "Yesterday",
  },
];

const userData = {
  name: "Jessica",
  goalMessage:
    "Welcome back! You're on track to achieve your goal of losing 3 lbs by June 14",
  avatarUrl: "https://e7.pngegg.com/pngimages/84/165/png-clipart-united-states-avatar-organization-information-user-avatar-service-computer-wallpaper-thumbnail.png", // Path to your image in the public folder
};

export default function Dashboard() {
  const [recentWorkouts, setRecentWorkouts] = useState(mockRecentWorkouts);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {

    const fetchData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setIsLoading(false);
    };

    fetchData();
  }, []);

  const handleAddWorkout = () => {
    router.push("/workout/new");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading dashboard...
      </div>
    );
  }

  return (
    <main className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">
        Your Fitness Dashboard
      </h1>

      <h1 className="text-xl font-bold mb-6">Dashboard</h1>

      <div className="grid gap-4 mb-6">
        <Profile
          name={userData.name}
          goalMessage={userData.goalMessage}
          avatarUrl={userData.avatarUrl}
        />
      </div>

      <div className="grid gap-4 mb-6">
        <StatsSummary />
      </div>
      <div className="bg-[#121417] p-6 rounded-xl mb-6">
        <ProgressBar label="Net Calories" value="1,500" progress={100} />
      </div>

      {/*  TODO: Add Weekly Activity */}
      {/* <div className="bg-white rounded-lg shadow p-4 mb-6">
        <h2 className="text-lg font-semibold mb-4">Weekly Activity Graph</h2>
      </div> */}

      <div className="rounded-lg shadow mb-6">
        <RecentWorkouts workouts={recentWorkouts} />
      </div>

      <div className="flex space-x-4 justify-center">
        <button
          onClick={handleAddWorkout}
          className="bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center"
        >
          <span className="mr-2">+</span> Add Workout
        </button>
      </div>


    </main>
  );
}
