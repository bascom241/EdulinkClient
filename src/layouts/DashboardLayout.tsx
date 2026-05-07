// layouts/DashboardLayout.tsx (Simplest version)
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { getTabsByRole } from "../config/tabs";


import CircularMenu from "../components/ui/CirclarMenu";
import BottomTabBar from "../components/ui/BottomBar";
import Sidebar from "../components/ui/SideBar";
const DashboardLayout: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const isMobile = useMediaQuery('(max-width: 768px)');
    const [showCircularMenu, setShowCircularMenu] = useState(false);
    
    // Get role directly from localStorage
    const role = localStorage.getItem('role');
    const tabs = getTabsByRole(role);
    const isIndex = location.pathname === "/dashboard";

    const handleNavigation = (path: string) => {
        navigate(path);
        setShowCircularMenu(false);
    };

    const handleLogout = () => {
        localStorage.removeItem('role');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    if (isIndex) {
        return <Outlet />;
    }

    // Mobile Layout
    if (isMobile) {
        return (
            <div className="relative min-h-screen bg-gray-50">
                <main className="pb-20">
                    <Outlet />
                </main>

                <BottomTabBar
                    mainTabs={tabs.mainTabs}
                    activePath={location.pathname}
                    onTabClick={handleNavigation}
                    onMoreClick={() => setShowCircularMenu(!showCircularMenu)}
                    isMoreOpen={showCircularMenu}
                />

                {tabs.moreTabs.length > 0 && (
                    <CircularMenu
                        tabs={tabs.moreTabs}
                        onSelect={handleNavigation}
                        onClose={() => setShowCircularMenu(false)}
                        isOpen={showCircularMenu}
                    />
                )}
            </div>
        );
    }

    // Desktop Layout
    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar
                tabs={tabs}
                activePath={location.pathname}
                onTabClick={handleNavigation}
                onLogout={handleLogout}
            />
            <main className="flex-1 p-6 overflow-auto">
                <div className="max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;