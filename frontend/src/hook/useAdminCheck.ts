import { RootState } from '@app/store'
import { IUserStore } from '@app/store/user'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Role } from '@app/enums/role.enum'

const useAdminCheck = () => {
  const navigate = useNavigate()
  const { userInfo } = useSelector<RootState, IUserStore>((s) => s.user)

  const checkAdmin = () => {
    if (userInfo.id && userInfo.role !== Role.ADMIN) {
      toast.warning('You do not have permission to access this page.')
      navigate('/')
      return false
    }

    return true
  }

  return {
    checkAdmin
  }
}

export default useAdminCheck
