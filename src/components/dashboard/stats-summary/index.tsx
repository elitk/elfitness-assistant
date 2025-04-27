import React from 'react';

interface StatCardProps {
  value: string | number;
  label: string;
}

function StatCard({ value, label }: StatCardProps) {
  return (
    <div className="bg-[#121417] text-white rounded-xl p-6 flex flex-col items-center">
      <div className="text-3xl font-bold mb-2">{value}</div>
      <div className="text-gray-400 text-sm">{label}</div>
    </div>
  );
}

export default function StatsSummary() {
  const stats = [
    { value: '1,200', label: 'Calories Burned' },
    { value: '1,500', label: 'Calories Consumed' },
    { value: '2,000', label: 'Net Calories' },
    { value: '7', label: 'Workouts' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <StatCard key={index} value={stat.value} label={stat.label} />
      ))}
    </div>
  );
}