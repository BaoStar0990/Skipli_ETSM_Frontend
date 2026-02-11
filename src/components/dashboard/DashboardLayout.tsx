import { motion } from 'motion/react'
import type { TabType } from '../../constants/DashboardTab.enum'
import DashBoardSidebar from './DashboardSidebar'
import AssignmentIcon from '@mui/icons-material/Assignment'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import GroupsIcon from '@mui/icons-material/Groups'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import authApi from '../../services/apis/auth-api'
import MessageIcon from '@mui/icons-material/Message'

interface DashboardLayoutProps {
  activeTab: TabType
  setActiveTab: (tab: TabType) => void
  children: React.ReactNode
}

export default function DashBoardLayout({
  activeTab,
  setActiveTab,
  children,
}: DashboardLayoutProps) {
  const navigate = useNavigate()
  const isEmployee = localStorage.getItem('userRole') === 'EMPLOYEE'

  const mutation = useMutation({
    mutationFn: authApi.logout,
  })

  const handleLogout = async () => {
    await mutation.mutateAsync()
    localStorage.removeItem('userRole')
    localStorage.removeItem('id')
    localStorage.removeItem('phoneNumber')
    navigate('/', { replace: true })
  }

  const tabs = [
    {
      id: 'EMPLOYEES' as TabType,
      label: 'Manage Employee',
      icon: GroupsIcon,
    },
    {
      id: 'SCHEDULES' as TabType,
      label: 'Employee Schedule',
      icon: CalendarMonthIcon,
    },
    {
      id: 'TASKS' as TabType,
      label: 'Task for Employee',
      icon: AssignmentIcon,
    },
    {
      id: 'CHAT' as TabType,
      label: 'Chat',
      icon: MessageIcon,
    },
  ].filter((tab) => !isEmployee || ['TASKS', 'CHAT'].includes(tab.id))

  return (
    <div className="flex h-screen bg-background">
      <DashBoardSidebar
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
      />

      <div className="flex-1 overflow-hidden flex flex-col">
        <header className="border-b border-border bg-card shadow-sm">
          <div className="px-8 py-5">
            <h1 className="text-3xl font-bold text-foreground">Employee Task Management System</h1>
            <p className="text-sm text-muted-foreground mt-2">
              Manage your team information and schedules
            </p>
          </div>
        </header>

        <main className="flex-1 overflow-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="p-8"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  )
}
