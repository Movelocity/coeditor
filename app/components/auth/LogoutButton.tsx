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
      className="flex items-center gap-2 text-muted-foreground hover:text-primary"
      aria-label="退出登录"
      tabIndex={0}
    >
      <span>退出登录</span>
    </div>
  )
}

export default LogoutButton 