import {cn} from '~/lib/utils'
import {TabType} from './SidebarTabs'

interface Tab {
  id: TabType
  label: string
  icon: React.ComponentType<{className?: string}>
}

interface TabNavigationProps {
  tabs: Tab[]
  activeTab: TabType
  setActiveTab: (tab: TabType) => void
}

export function TabNavigation({
  tabs,
  activeTab,
  setActiveTab,
}: TabNavigationProps) {
  return (
    <div className="w-[80px] border-r border-gray-200 bg-gray-50 font-sans">
      <div className="flex flex-col">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex flex-col items-center px-2 py-4 text-xs transition-colors',
                activeTab === tab.id
                  ? 'border-r-2 border-brand-accent bg-white text-brand-accent'
                  : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
              )}
              title={tab.label}
            >
              <Icon className="mb-1 h-5 w-5" />
              <span className="text-center leading-tight">{tab.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
