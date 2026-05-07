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
      return activePath.startsWith('/dashboard/teacher');
    }
    if (tab.path === '/dashboard/student') {
      return activePath.startsWith('/dashboard/student');
    }
    return activePath === tab.path;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg shadow-lg border-t border-gray-200 z-40">
      <div className="flex justify-around items-center px-2 py-2 max-w-md mx-auto">
        {mainTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = isActiveTab(tab);
          
          return (
            <button
              key={tab.path}
              onClick={() => onTabClick(tab.path)}
              className={`flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-all duration-200 relative ${
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
          className={`flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-all duration-200 ${
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