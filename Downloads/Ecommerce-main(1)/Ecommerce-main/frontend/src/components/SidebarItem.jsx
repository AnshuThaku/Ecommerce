
import React from "react"
import { ChevronRight } from "lucide-react"

const SidebarItem = ({
  icon: Icon,
  label,
  id,
  activeTab,
  setActiveTab,
  isSubItem = false
}) => {

  const isActive = activeTab === id

  return (
    <div
      onClick={() => {
        if (setActiveTab) {
          setActiveTab(id)
        }
      }}
      className={`flex items-center justify-between p-4 cursor-pointer transition-all duration-300
      ${
        isActive
          ? "bg-gray-100 text-black border-r-4 border-gray-400 font-semibold"
          : "text-black hover:bg-gray-100 hover:text-black"
      }
      ${isSubItem ? "pl-12 py-2 text-sm" : ""}
      `}
    >
      <div className="flex items-center gap-3">
        {Icon && <Icon size={isSubItem ? 16 : 20} />}
        <span>{label}</span>
      </div>

      {!isSubItem && (
        <ChevronRight
          size={16}
          className={isActive ? "text-gray-600" : "text-gray-400"}
        />
      )}
    </div>
  )
}

export default SidebarItem