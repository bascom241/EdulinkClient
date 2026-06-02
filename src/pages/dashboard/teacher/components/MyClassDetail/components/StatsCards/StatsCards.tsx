// MyClassDetail/components/StatsCards/StatsCards.tsx
import React from 'react';
import StatCard from './StatCard';
import type { StatCardData } from '../../types/classroom.types';

interface StatsCardsProps {
  totalStudents: number;
  totalSessions: number;
  completedSessions: number;
  ongoingSessions: number;
  courseProgress: number;
  maximumStudent: number;
}

const StatsCards: React.FC<StatsCardsProps> = ({ 
  totalStudents, 
  totalSessions, 
  completedSessions, 
  ongoingSessions, 
  courseProgress,
  maximumStudent 
}) => {
  const stats: StatCardData[] = [
    {
      title: "Total Students",
      value: totalStudents,
      subtitle: `Max capacity: ${maximumStudent}`,
      icon: "fa-users",
      bgColor: "bg-green-50",
      iconColor: "text-green-600"
    },
    {
      title: "Total Sessions",
      value: totalSessions,
      subtitle: `${completedSessions} completed, ${ongoingSessions} ongoing`,
      icon: "fa-calendar-check",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600"
    },
    {
      title: "Avg. Attendance",
      value: "85%",
      subtitle: "Per session average",
      icon: "fa-chart-line",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600"
    },
    {
      title: "Course Progress",
      value: `${courseProgress}%`,
      subtitle: "Overall completion",
      icon: "fa-flag-checkered",
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600",
      progress: courseProgress
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};

export default StatsCards;