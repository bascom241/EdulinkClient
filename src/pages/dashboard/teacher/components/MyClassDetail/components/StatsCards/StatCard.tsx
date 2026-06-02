// MyClassDetail/components/StatsCards/StatCard.tsx
import React from 'react';
import type { StatCardData } from '../../types/classroom.types';

const StatCard: React.FC<StatCardData> = ({ 
  title, 
  value, 
  subtitle, 
  icon, 
  bgColor, 
  iconColor, 
  progress 
}) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-md transition-all">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-12 h-12 ${bgColor} rounded-xl flex items-center justify-center`}>
          <i className={`fas ${icon} ${iconColor} text-xl`}></i>
        </div>
        <span className="text-3xl font-bold text-gray-800">{value}</span>
      </div>
      <p className="text-gray-600 font-medium mb-1">{title}</p>
      <p className="text-sm text-gray-400">{subtitle}</p>
      
      {progress !== undefined && (
        <div className="mt-2">
          <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-green-500 rounded-full h-2 transition-all duration-500" 
              style={{ width: `${progress}%` }}
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default StatCard;