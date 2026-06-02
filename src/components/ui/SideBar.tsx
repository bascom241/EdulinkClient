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

  const primaryTabs = tabs.mainTabs.filter((tab) => tab.path !== "/dashboard");
  const utilityTabs = tabs.moreTabs.filter((tab) =>
    ["/dashboard/settings", "/dashboard/messages", "/dashboard/notifications"].includes(tab.path)
  );
  const workspaceTabs = tabs.moreTabs.filter((tab) => !utilityTabs.some((item) => item.path === tab.path));

  const renderTabs = (items: Tab[]) => (
    <nav className="space-y-1">
      {items.map((tab) => {
        const Icon = tab.icon;
        const isActive = isActiveTab(tab);

        return (
          <button
            key={tab.path}
            onClick={() => onTabClick(tab.path)}
            className={`group relative w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
              isActive
                ? "bg-green-50 text-green-700 font-semibold shadow-sm"
                : "text-gray-600 hover:bg-[var(--app-surface-soft)] hover:text-gray-900"
            }`}
          >
            {isActive && <span className="absolute left-0 h-6 w-1 rounded-r-full bg-green-500" />}
            <Icon
              size={20}
              className={`transition-colors duration-200 ${
                isActive ? "text-green-600" : "text-gray-400 group-hover:text-gray-600"
              }`}
            />
            <span className="text-sm font-medium">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );

  return (
    <aside className="app-panel w-72 h-screen text-gray-700 flex flex-col sticky top-0 rounded-none border-y-0 border-l-0">
      <div className="px-5 pt-5 pb-4">
        <div className="flex items-center gap-3">
          <img src="/EdlinkLogo.png" alt="Edlink" className="h-10 w-10 rounded-lg object-cover" />
          <div>
            <h1 className="text-xl font-bold text-gray-900">Edlink</h1>
            <p className="text-xs text-green-600 font-semibold">Learning workspace</p>
          </div>
        </div>
        <div className="app-button-secondary mt-5 rounded-xl p-3">
          <p className="text-xs font-semibold">Today</p>
          <p className="mt-1 text-sm">Manage classes, schedules, and progress from one place.</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 space-y-5">
        <div>
          <p className="px-3 pb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Main</p>
          {renderTabs(primaryTabs)}
        </div>
        <div>
          <p className="px-3 pb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Workspace</p>
          {renderTabs(workspaceTabs)}
        </div>
        <div>
          <p className="px-3 pb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Account</p>
          {renderTabs(utilityTabs)}
        </div>
      </div>

      {/* Logout Section */}
      <div className="border-t border-[var(--app-border)] px-3 py-4">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-gray-600 hover:bg-[var(--app-surface-soft)] hover:text-gray-900 group"
        >
          <LogOut size={20} className="text-gray-400 group-hover:text-gray-600" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
