import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "./useAuth"
import { toast } from "react-toastify"
import { useTranslation } from "react-i18next"


const useAuthRedirect = (shoudSkip?: boolean) => {
  const navigate = useNavigate()
  const { isLogin } = useAuth()
  const { t } = useTranslation()

  useEffect(() => {
    if (!isLogin && !shoudSkip) {
      navigate("/")
      toast.warning(t('hooks.auth_redirect_warning'))
      return
    }
  }, [isLogin, navigate])
}

export default useAuthRedirect
