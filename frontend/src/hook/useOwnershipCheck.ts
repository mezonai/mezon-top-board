import { RootState } from '@app/store'
import { IUserStore } from '@app/store/user'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAuth } from './useAuth'
import { Role } from '@app/enums/role.enum'

import { useTranslation } from 'react-i18next'

const useOwnershipCheck = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { isLogin } = useAuth()
  const { userInfo } = useSelector<RootState, IUserStore>((s) => s.user)

  const checkOwnership = (ownerId?: string, shouldReplaceRoute?: boolean) => {
    if (!isLogin) {
      toast.error(t('hooks.ownership_check_login'))
      navigate("/login")
      return false
    }

    if (ownerId && ownerId !== userInfo.id && userInfo.role !== Role.ADMIN) {
      toast.error(t('hooks.ownership_check_permission'))
      navigate('/', { replace: shouldReplaceRoute })
      return false
    }

    return true
  }

  return {
    checkOwnership
  }
}

export default useOwnershipCheck
