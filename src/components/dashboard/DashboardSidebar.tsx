import { motion } from 'motion/react'
import type { TabType } from '../../constants/DashboardTab.enum'
import type { ComponentType } from 'react'

interface SidebarProps {
  tabs: Array<{
    id: TabType
    label: string
    icon: ComponentType<{ className?: string }>
    disabled?: boolean
  }>
  activeTab: TabType
  setActiveTab: (tab: TabType) => void
  onLogout: () => void
}

export default function DashBoardSidebar({
  tabs,
  activeTab,
  setActiveTab,
  onLogout,
}: SidebarProps) {
  return (
    <aside className="w-64 bg-sidebar-background border-r border-sidebar-border h-screen flex flex-col">
      <nav className="flex-1 px-4 py-6 space-y-2">
        {tabs.map((tab, index) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          const isDisabled = tab.disabled

          return (
            <motion.button
              key={tab.id}
              onClick={() => {
                if (isDisabled) return
                setActiveTab(tab.id)
              }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={isDisabled ? undefined : { x: 4 }}
              whileTap={isDisabled ? undefined : { scale: 0.98 }}
              disabled={isDisabled}
              aria-disabled={isDisabled}
              className={`relative w-full flex items-center gap-3 px-4 py-2 rounded-md transition-colors ${
                isActive
                  ? 'bg-sidebar-primary/10 text-sidebar-primary-foreground font-medium'
                  : isDisabled
                    ? 'text-sidebar-foreground/50 cursor-not-allowed'
                    : 'text-sidebar-foreground hover:bg-sidebar-hover hover:text-foreground'
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-medium">{tab.label}</span>

              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute left-0 top-0 bottom-0 w-1 bg-sidebar-primary-foreground rounded-r-full"
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: 0.2 }}
                />
              )}
            </motion.button>
          )
        })}
      </nav>
      <div className="px-4 pb-6">
        <button
          type="button"
          onClick={onLogout}
          className="w-full rounded-md border border-sidebar-border px-4 py-2 text-sm font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-hover hover:text-foreground hover:cursor-pointer"
        >
          Log out
        </button>
      </div>
    </aside>
  )
}
