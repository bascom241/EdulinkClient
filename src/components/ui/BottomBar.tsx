// components/BottomTabBar.tsx
import { MoreVertical, X } from 'lucide-react';
import type { Tab } from '../../types';

interface BottomTabBarProps {
  mainTabs: Tab[];
  activePath: string;
  onTabClick: (path: string) => void;
  onMoreClick: () => void;
  isMoreOpen: boolean;
}

const BottomTabBar: React.FC<BottomTabBarProps> = ({ 
  mainTabs, 
  activePath, 
  onTabClick, 
  onMoreClick, 
  isMoreOpen 
}) => {
  const isActiveTab = (tab: Tab): boolean => {
    if (tab.path === '/dashboard') {
      return activePath === '/dashboard';
    }
    if (tab.path === '/dashboard/teacher') {
      return activePath === '/dashboard/teacher' || activePath === '/dashboard/teacher/';
    }
    if (tab.path === '/dashboard/student') {
      return activePath === '/dashboard/student' || activePath === '/dashboard/student/';
    }
    return activePath === tab.path;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white/95 shadow-lg backdrop-blur-lg">
      <div className="mx-auto flex max-w-md items-center gap-1 overflow-x-auto px-2 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {mainTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = isActiveTab(tab);
          
          return (
            <button
              key={tab.path}
              onClick={() => onTabClick(tab.path)}
              className={`relative flex min-w-[68px] shrink-0 flex-col items-center justify-center rounded-xl px-3 py-2 transition-all duration-200 ${
                isActive ? 'text-green-600' : 'text-gray-500 hover:text-green-500'
              }`}
            >
              <Icon 
                size={24} 
                className={`transition-all duration-200 ${isActive ? 'scale-110' : ''}`}
                fill={isActive ? 'currentColor' : 'none'}
              />
              <span className={`text-xs mt-1 ${isActive ? 'font-semibold' : ''}`}>
                {tab.label}
              </span>
              {isActive && (
                <div className="absolute -top-2 w-1 h-1 bg-green-600 rounded-full" />
              )}
            </button>
          );
        })}
        
        {/* More Button */}
        <button
          onClick={onMoreClick}
          className={`flex min-w-[68px] shrink-0 flex-col items-center justify-center rounded-xl px-3 py-2 transition-all duration-200 ${
            isMoreOpen ? 'text-green-600' : 'text-gray-500 hover:text-green-500'
          }`}
        >
          {isMoreOpen ? <X size={24} /> : <MoreVertical size={24} />}
          <span className="text-xs mt-1">More</span>
        </button>
      </div>
    </div>
  );
};

export default BottomTabBar;
