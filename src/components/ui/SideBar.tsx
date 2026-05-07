// components/Sidebar.tsx
import { LogOut } from "lucide-react";
import type { Tab, TabsConfig } from "../../types";


interface SidebarProps {
  tabs: TabsConfig;
  activePath: string;
  onTabClick: (path: string) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  tabs,
  activePath,
  onTabClick,
  onLogout,
}) => {
  const allTabs: Tab[] = [...tabs.mainTabs, ...tabs.moreTabs];

  const isActiveTab = (tab: Tab): boolean => {
  // Exact match for dashboard
  if (tab.path === "/dashboard") {
    return activePath === "/dashboard";
  }
  
  // For teacher routes - only match if the active path EXACTLY matches or is a direct child
  if (tab.path === "/dashboard/teacher") {
    // Only active if the path is exactly "/dashboard/teacher" or "/dashboard/teacher/"
    // NOT for "/dashboard/teacher/create-class" or other sub-routes
    return activePath === "/dashboard/teacher" || activePath === "/dashboard/teacher/";
  }
  
  // For student routes
  if (tab.path === "/dashboard/student") {
    return activePath === "/dashboard/student" || activePath === "/dashboard/student/";
  }
  
  // For all other tabs, use exact match
  return activePath === tab.path;
};

  return (
    <aside className="w-64 h-screen bg-white text-gray-700 flex flex-col sticky top-0 border-r border-gray-200">
      {/* Logo Section */}
      <div className="px-6 pt-6 pb-4">
        <h1 className="text-2xl font-bold text-green-600">Edulink</h1>
        <p className="text-xs text-gray-400 mt-1">BUY PLAN TO LEARN</p>
      </div>

      {/* Menu Label */}
      <div className="px-6 pt-4 pb-2">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          MENU
        </p>
      </div>

      {/* Navigation Section */}
      <div className="flex-1 overflow-y-auto px-3">
        <nav className="space-y-1">
          {allTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = isActiveTab(tab);

            return (
              <button
                key={tab.path}
                onClick={() => onTabClick(tab.path)}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-lg 
                  transition-all duration-200 group
                  ${isActive 
                    ? "bg-green-50 text-green-700 font-semibold" 
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }
                `}
              >
                <Icon
                  size={20}
                  className={`
                    transition-colors duration-200
                    ${isActive 
                      ? "text-green-600" 
                      : "text-gray-400 group-hover:text-gray-600"
                    }
                  `}
                />
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Logout Section */}
      <div className="border-t border-gray-200 px-3 py-4">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-gray-600 hover:bg-gray-100 hover:text-gray-900 group"
        >
          <LogOut size={20} className="text-gray-400 group-hover:text-gray-600" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;