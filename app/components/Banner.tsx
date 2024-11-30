'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import LogoutButton from "@/components/auth/LogoutButton"
import cn from "classnames"
interface BannerProps {
  title: string
  description: string
  showTabs?: boolean
  children?: React.ReactNode
  className?: string
}

const Banner = ({ title, description, showTabs = false, children, className }: BannerProps) => {
  return (
    <>
      <div className={cn("fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-sm border-b border-gray-800", className)}>
        <div className="h-16 px-4 max-w-7xl mx-auto">
          {showTabs ? (
            <Tabs defaultValue="private" className="h-full">
              <div className="flex items-center justify-between h-full">
                <div className="flex items-center space-x-4">
                  <h1 className="text-xl font-bold text-gray-200">{title}</h1>
                  <p className="text-sm text-gray-400">{description}</p>
                </div>
                <TabsList className="grid grid-cols-2 w-[200px]">
                  <TabsTrigger value="private">Private</TabsTrigger>
                  <TabsTrigger value="public">Public</TabsTrigger>
                </TabsList>
                <LogoutButton />
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