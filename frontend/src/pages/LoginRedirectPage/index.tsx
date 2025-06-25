import { useAuth } from '@app/hook/useAuth'
import { useAuthControllerVerifyOAuth2Mutation } from '@app/services/api/auth/auth'
import { storeAccessTokens } from '@app/utils/storage'
import { Flex, Spin } from 'antd'
import { useEffect, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'

export const LoginRedirectPage = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [verifyOauth2Service] = useAuthControllerVerifyOAuth2Mutation()

  const { postLogin } = useAuth()

  const urlParams = useMemo(
    () => ({
      code: searchParams.get('code'),
      scope: searchParams.get('scope'),
      state: searchParams.get('state')
    }),
    [searchParams]
  )

  const handleOAuthLogin = async () => {
    const { code, scope, state } = urlParams
    if (!code || !state) {
      toast.error('Login failed: Something went wrong!')
      navigate('/')
      return
    }

    try {
      const { data } = await verifyOauth2Service({ oAuth2Request: { code, scope: scope || 'openid' } })
      if (!data) {
        toast.error('Login failed!')
        return
      }
      storeAccessTokens(data.data)
      postLogin()
      toast.success('Login successfully!')
    } catch (_) {
      toast.error('Login failed!')
    } finally {
      navigate('/', { replace: true })
    }
  }

  useEffect(() => {
    handleOAuthLogin()
  }, [urlParams])

  return (
    <Flex align='center' justify='center' vertical flex={1} className='!bg-gray-300 fixed inset-0 z-[9999]'>
      <Spin size='large' />
    </Flex>
  )
}
