import { useState } from 'react'
import DashBoardLayout from '../components/dashboard/DashboardLayout'
import type { TabType } from '../constants/DashboardTab.enum'
import ScheduleTab from '../components/dashboard/ScheduleTab'
import TaskTab from '../components/dashboard/TaskTab'
import EmployeeTab from '../components/dashboard/EmployeeTab'
import ChatTab from '../components/dashboard/ChatTab'

const DashboardPage = () => {
  const isEmployee = localStorage.getItem('userRole') === 'EMPLOYEE'
  const [activeTab, setActiveTab] = useState<TabType>(isEmployee ? 'TASKS' : 'EMPLOYEES')

  const handleSetActiveTab = (nextTab: TabType) => {
    if (isEmployee && (nextTab === 'EMPLOYEES' || nextTab === 'SCHEDULES')) {
      setActiveTab('TASKS')
      return
    }

    setActiveTab(nextTab)
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'EMPLOYEES':
        return <EmployeeTab />
      case 'SCHEDULES':
        return <ScheduleTab />
      case 'TASKS':
        return <TaskTab />
      case 'CHAT':
        return <ChatTab />
      default:
        return <ScheduleTab />
    }
  }

  return (
    <DashBoardLayout activeTab={activeTab} setActiveTab={handleSetActiveTab}>
      {renderContent()}
    </DashBoardLayout>
  )
}
export default DashboardPage
