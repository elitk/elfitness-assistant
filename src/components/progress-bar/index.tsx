import React from 'react';

interface ProgressBarProps {
  label: string;
  value: number | string;
  progress: number;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  label, 
  value, 
  progress, 
  className = '' 
}) => {
  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-white text-lg font-medium">{label}</span>
        <span className="text-white text-lg font-medium">{value}</span>
      </div>
      
      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
        <div 
          className="h-full bg-white rounded-full" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;