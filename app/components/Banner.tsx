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
}

const Banner = ({ 
  title, 
  description, 
  username, 
  children, 
  className, 
  showChevron,
  onChevronClick
}: BannerProps) => {
  return (
    <>
      <div className={cn("bg-gray-900/80 backdrop-blur-sm border-b border-gray-800", className)}>
        <div className="h-16 px-4 mx-auto">
          <div className="flex items-center justify-between h-full">
            <div className="flex items-baseline md:items-center space-x-4 flex-col md:flex-row">
              {
                showChevron && (
                  <button
                    onClick={() => onChevronClick?.()}
                    className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded-md flex items-center justify-center touch-manipulation z-10"
                    aria-label={"展开侧边栏"}
                  >
                    <FaChevronRight className="w-4 h-4 text-gray-400" />
                  </button>
                )
              }
              <h1 className="text-xl font-bold text-gray-200">{title}</h1>
              <p className="text-sm text-gray-400">{description}</p>
            </div>
            {
              username ? (
                <span className="text-sm text-gray-400 flex flex-row items-center gap-2">
                {username} <LogoutBtn />
                </span>
              )
              :(
                <span className="text-sm text-gray-400 flex flex-row items-center gap-2">
                Login <LoginBtn />
                </span>
              )
            }
          </div>
        </div>
      </div>
    </>
  )
}

export default Banner 