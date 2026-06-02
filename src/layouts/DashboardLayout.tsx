// layouts/DashboardLayout.tsx (Simplest version)
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { getTabsByRole } from "../config/tabs";


import CircularMenu from "../components/ui/CirclarMenu";
import BottomTabBar from "../components/ui/BottomBar";
import Sidebar from "../components/ui/SideBar";
import ThemeToggle from "../components/ui/ThemeToggle";
import { HiOutlineSearch } from "react-icons/hi";
import { useLiveNotifications } from "../realtime/useLiveNotifications.tsx";
const DashboardLayout: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const isMobile = useMediaQuery('(max-width: 768px)');
    const [showCircularMenu, setShowCircularMenu] = useState(false);
    useLiveNotifications();
    
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
            <div className="app-workspace relative min-h-screen">
                <header className="sticky top-0 z-30 border-b border-[var(--app-border)] bg-[var(--app-surface)]/90 px-4 py-3 backdrop-blur">
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wide app-muted">Edlink</p>
                            <h1 className="text-base font-bold text-[var(--app-text)]">Workspace</h1>
                        </div>
                        <ThemeToggle />
                    </div>
                </header>
                <main className="px-4 py-4 pb-24">
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
        <div className="app-workspace flex min-h-screen">
            <Sidebar
                tabs={tabs}
                activePath={location.pathname}
                onTabClick={handleNavigation}
                onLogout={handleLogout}
            />
            <main className="flex-1 overflow-auto">
                <header className="sticky top-0 z-30 border-b border-[var(--app-border)] bg-[var(--app-surface)]/88 px-6 py-3 backdrop-blur-xl">
                    <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
                        <div className="app-control hidden h-10 min-w-80 items-center gap-2 rounded-lg px-3 lg:flex">
                            <HiOutlineSearch className="app-muted" size={18} />
                            <span className="text-sm app-muted">Search classes, students, assignments...</span>
                        </div>
                        <div className="ml-auto flex items-center gap-3">
                            <div className="hidden rounded-lg bg-green-50 px-3 py-2 text-sm font-semibold text-green-700 ring-1 ring-green-100 lg:block">
                                White and green workspace
                            </div>
                            <ThemeToggle />
                        </div>
                    </div>
                </header>
                <div className="max-w-7xl mx-auto p-6">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
