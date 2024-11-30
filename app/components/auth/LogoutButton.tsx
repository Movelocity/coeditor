import { useApp } from "@/contexts/AppContext"

const LogoutButton = () => {
  const { logout } = useApp()
  
  const handleLogout = () => {
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
      className="flex items-center gap-2 text-muted-foreground text-gray-500 hover:bg-gray-800 rounded-md p-1 w-24 text-center cursor-pointer"
      aria-label="退出登录"
      tabIndex={0}
    >
      退出登录
    </div>
  )
}

export default LogoutButton 