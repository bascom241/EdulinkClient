import React from 'react'
import { LogOut, Menu, X } from 'lucide-react'
import { useAuthStore } from '../features/auth/store'
import { useNavigate } from 'react-router-dom'
import Button from './ui/Button'

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = React.useState(true)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: '📊' },
    ...(user?.role === 'ROLE_TEACHER'
      ? [{ label: 'My Classrooms', href: '/dashboard/teacher/classrooms', icon: '🎓' }]
      : [{ label: 'Browse Classes', href: '/dashboard/student/classes', icon: '📚' }]),
    { label: 'Profile', href: '/dashboard/profile', icon: '👤' },
  ]

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-50">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-neutral-100 rounded-lg text-neutral-600"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <h1 className="text-2xl font-bold text-primary-700">EdLink</h1>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-neutral-600">{user?.name}</span>
            <Button
              variant="ghost"
              size="sm"
              icon={<LogOut className="w-4 h-4" />}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        {sidebarOpen && (
          <aside className="w-64 bg-white border-r border-neutral-200 min-h-screen">
            <nav className="p-6 space-y-2">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3 text-neutral-700 hover:bg-primary-50 rounded-lg transition-fast"
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </a>
              ))}
            </nav>
          </aside>
        )}

        {/* Main Content */}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}

export default DashboardLayout
