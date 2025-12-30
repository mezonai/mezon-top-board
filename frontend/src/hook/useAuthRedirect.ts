import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "./useAuth"
import { toast } from "react-toastify"

import { useTranslation } from "react-i18next"

const useAuthRedirect = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { isLogin } = useAuth()

  useEffect(() => {
    if (!isLogin) {
      navigate("/")
      toast.warning(t('hooks.auth_redirect_warning'))
      return
    }
  }, [isLogin, navigate])
}

export default useAuthRedirect
