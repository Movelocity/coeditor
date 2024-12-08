'use client'
import LogoutBtn from "@/components/auth/LogoutBtn"
import LoginBtn from "@/components/auth/LoginBtn"
import cn from "classnames"
import { FaChevronRight } from "react-icons/fa";

interface BannerProps {
  title?: string
  description: string
  username?: string
  children?: React.ReactNode
  className?: string
  showChevron?: boolean
  onChevronClick?: () => void
  showPreviewToggle?: boolean
  isPreviewMode?: boolean
  onPreviewToggle?: () => void
  hasUnsavedChanges?: boolean
}

const Banner = ({ 
  title, 
  description, 
  username, 
  children, 
  className, 
  showChevron,
  onChevronClick,
  showPreviewToggle,
  isPreviewMode,
  onPreviewToggle,
  hasUnsavedChanges
}: BannerProps) => {
  const shrinked = showChevron;
  return (
    <div className={cn("bg-gray-900/80 backdrop-blur-sm border-b border-gray-800", className)}>
      <div className="h-16 px-4 mx-auto flex flex-row items-center w-full">
        {
          showChevron && (
            <button
              onClick={() => onChevronClick?.()}
              className="mr-2 w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded-md flex items-center justify-center touch-manipulation z-10"
              aria-label={"展开侧边栏"}
            >
              <FaChevronRight className="w-4 h-4 text-gray-400" />
            </button>
          )
        }
        <div className="flex items-center justify-between w-full">
          <div className={cn("flex items-baseline md:items-center space-x-4 flex-col md:flex-row", !shrinked && "hidden md:flex")}>
            <h1 className="text-xl font-bold text-gray-200">{title}</h1>
            <p className="text-sm text-gray-400">{description}</p>
          </div>
          <div className={cn(shrinked && "hidden")}>{/* 占位 */}</div>
          <div className="flex items-center gap-4">
            {showPreviewToggle && (
              <button
                onClick={onPreviewToggle}
                className="px-3 py-1 text-sm bg-gray-800 hover:bg-gray-700 rounded-sm text-gray-200 opacity-70 hover:opacity-100"
              >
                {isPreviewMode ? '编辑' : '预览'}
              </button>
            )}
            {hasUnsavedChanges !== undefined && (
              <span className="text-xs text-gray-500 opacity-70">
                {hasUnsavedChanges ? '未保存' : '已保存'}
              </span>
            )}
            {username ? (
              <span className="text-sm text-gray-400 flex flex-row items-center gap-2">
                {username} <LogoutBtn />
              </span>
            ) : (
              <span className="text-sm text-gray-400 flex flex-row items-center gap-2">
                Login <LoginBtn />
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Banner 