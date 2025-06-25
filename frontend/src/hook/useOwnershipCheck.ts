import { RootState } from '@app/store'
import { IUserStore } from '@app/store/user'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAuth } from './useAuth'

const useOwnershipCheck = () => {
  const navigate = useNavigate()
  const { isLogin } = useAuth()
  const { userInfo } = useSelector<RootState, IUserStore>((s) => s.user)

  const checkOwnership = (ownerId?: string, shouldReplaceRoute?: boolean) => {
    if (!isLogin) {
      toast.error("You need to login to access this page.")
      navigate("/login")
      return false
    }

    if (ownerId && ownerId !== userInfo.id && userInfo.role !== 'ADMIN') {
      toast.error('You do not have permission to access this page.')
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
