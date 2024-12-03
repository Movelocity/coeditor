import { RiLoginBoxFill } from "react-icons/ri";
import { useRouter } from "next/navigation"

const LoginBtn = () => {
  const router = useRouter()

  const handleLogin = async () => {
    router.push('/auth')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      handleLogin()
    }
  }

  return (
    <div
      onClick={handleLogin}
      onKeyDown={handleKeyDown}
      className="flex items-center justify-center p-2 text-muted-foreground hover:bg-gray-800 rounded-md cursor-pointer"
      aria-label="登陆"
      title="登录"
      tabIndex={0}
    >
      <RiLoginBoxFill className="h-5 w-5" />
    </div>
  )
}

export default LoginBtn 