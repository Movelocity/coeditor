'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import LogoutBtn from "@/components/auth/LogoutBtn"
import LoginBtn from "@/components/auth/LoginBtn"
import cn from "classnames"
interface BannerProps {
  title: string
  description: string
  username?: string
  showTabs?: boolean
  children?: React.ReactNode
  className?: string
  defaultTab?: 'public' | 'private'
  onTabChange?: (tab: string) => void
  currentTab?: string
}

const Banner = ({ 
  title, 
  description, 
  username, 
  showTabs = false, 
  children, 
  className, 
  defaultTab = 'private', 
  onTabChange, 
  currentTab 
}: BannerProps) => {
  return (
    <>
      <div className={cn("fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-sm border-b border-gray-800", className)}>
        <div className="h-16 px-4 mx-auto">
          {showTabs ? (
            <Tabs 
              defaultValue={defaultTab}
              value={currentTab} 
              className="h-full"
              onValueChange={onTabChange}
            >
              <div className="flex items-center justify-between h-full">
                <div className="flex items-center space-x-4">
                  <h1 className="text-xl font-bold text-gray-200">{title}</h1>
                  <p className="text-sm text-gray-400">{description}</p>
                </div>
                <TabsList className="grid grid-cols-2 w-[200px]">
                  <TabsTrigger value="public">Public</TabsTrigger>
                  <TabsTrigger value="private">Private</TabsTrigger>
                </TabsList>
                
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

              {/* Content area */}
              <div className="">
                <TabsContent value="private">
                  {children}
                </TabsContent>
                <TabsContent value="public">
                  {children}
                </TabsContent>
              </div>
            </Tabs>
          ) : (
            <div className="flex items-center h-full">
              <div className="flex items-center space-x-4">
                <h1 className="text-xl font-bold text-gray-200">{title}</h1>
                <p className="text-sm text-gray-400">{description}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Spacer to prevent content from going under fixed banner */}
      <div className="h-16" />
    </>
  )
}

export default Banner 