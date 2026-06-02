import React from 'react';
import { HiOutlineArrowLeft, HiOutlineBookOpen, HiOutlineVideoCamera } from "react-icons/hi";
import type { Classroom } from '../../types/classroom.types';

interface ClassDetailHeaderProps {
  classData: Classroom;
  ongoingSessions: number;
  onBack: () => void;
}

const ClassDetailHeader: React.FC<ClassDetailHeaderProps> = ({ 
  classData, 
  ongoingSessions, 
  onBack 
}) => {
  return (
    <div className="app-panel sticky top-[65px] z-10 rounded-2xl backdrop-blur-md">
      <div className="max-w-[1400px] mx-auto px-5 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-500 hover:text-green-600 transition-all duration-200"
              aria-label="Go back"
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors">
                <HiOutlineArrowLeft className="h-4 w-4" />
              </div>
              <span className="text-sm font-medium hidden sm:inline">Back</span>
            </button>
            
            <div className="hidden sm:block h-5 w-px bg-gray-200"></div>
            
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-green-400 to-green-500 rounded-xl flex items-center justify-center shadow-sm">
                <HiOutlineBookOpen className="h-5 w-5 text-white" />
              </div>
              
              <div>
                <h1 className="text-lg font-semibold text-gray-800 tracking-tight">
                  {classData.name}
                </h1>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {ongoingSessions > 0 && (
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-red-50 rounded-full">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                <HiOutlineVideoCamera className="h-4 w-4 text-red-600" />
                <span className="text-xs font-medium text-red-600">
                  {ongoingSessions} Live Now
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassDetailHeader;
