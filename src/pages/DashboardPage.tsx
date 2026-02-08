import { useEffect, useState } from 'react'
import DashBoardLayout from '../components/dashboard/DashboardLayout'
import type { TabType } from '../constants/DashboardTab.enum'
import ScheduleTab from '../components/dashboard/ScheduleTab'
import TaskTab from '../components/dashboard/TaskTab'
import EmployeeTab from '../components/dashboard/EmployeeTab'

const DashboardPage = () => {
  const isEmployee = localStorage.getItem('userRole') === 'EMPLOYEE'
  const [activeTab, setActiveTab] = useState<TabType>(isEmployee ? 'TASKS' : 'EMPLOYEES')

  useEffect(() => {
    if (isEmployee && (activeTab === 'EMPLOYEES' || activeTab === 'SCHEDULES')) {
      setActiveTab('TASKS')
    }
  }, [activeTab, isEmployee])

  const renderContent = () => {
    switch (activeTab) {
      case 'EMPLOYEES':
        return <EmployeeTab />
      case 'SCHEDULES':
        return <ScheduleTab />
      case 'TASKS':
        return <TaskTab />
      default:
        return <ScheduleTab />
    }
  }

  return (
    <DashBoardLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </DashBoardLayout>
  )
}
export default DashboardPage
