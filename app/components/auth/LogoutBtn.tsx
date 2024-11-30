import { useApp } from "@/contexts/AppContext"
import { ArrowRightEndOnRectangleIcon } from "@heroicons/react/24/outline"
const LogoutButton = () => {
  const { logout } = useApp()
  
  const handleLogout = async () => {
    logout()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      handleLogout()
    }
  }

  return (
    <div
      onClick={handleLogout}
      onKeyDown={handleKeyDown}
      className="flex items-center justify-center p-2 text-muted-foreground hover:bg-gray-800 rounded-md cursor-pointer"
      aria-label="退出登录"
      title="退出登录"
      tabIndex={0}
    >
      <ArrowRightEndOnRectangleIcon className="h-5 w-5" />
    </div>
  )
}

export default LogoutButton 