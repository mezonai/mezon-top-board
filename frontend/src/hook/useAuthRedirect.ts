import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "./useAuth"
import { toast } from "react-toastify"

const useAuthRedirect = (shoudSkip?: boolean) => {
  const navigate = useNavigate()
  const { isLogin } = useAuth()

  useEffect(() => {
    if (!isLogin && !shoudSkip) {
      navigate("/")
      toast.warning('Sorry, you are not authorized to access this page')
      return
    }
  }, [isLogin, navigate])
}

export default useAuthRedirect
