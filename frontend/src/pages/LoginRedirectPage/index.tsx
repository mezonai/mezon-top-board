import { useAuth } from '@app/hook/useAuth'
import { useAuthControllerVerifyOAuth2Mutation } from '@app/services/api/auth/auth'
import { storeAccessTokens } from '@app/utils/storage'
import { Flex, Spin } from 'antd'
import { useEffect, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useLazyUserControllerGetUserDetailsQuery } from '@app/services/api/user/user'

export const LoginRedirectPage = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [verifyOauth2Service] = useAuthControllerVerifyOAuth2Mutation()
  const [getUserInfo] = useLazyUserControllerGetUserDetailsQuery()

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
        navigate('/', { replace: true })
        return
      }
      storeAccessTokens(data.data)
      postLogin()

      const userResp = await getUserInfo().unwrap().catch(() => null)
      const isFirstLogin = !!userResp?.data?.isFirstLogin

      toast.success('Login successfully!')
      navigate(isFirstLogin ? '/welcome' : '/', { replace: true })
    } catch (_) {
      toast.error('Login failed!')
      navigate('/', { replace: true })
    }
  }

  useEffect(() => {
    handleOAuthLogin()
  }, [urlParams])

  return (
    <Flex align='center' justify='center' vertical flex={1} className='fixed inset-0 z-[9999] bg-bg-content'>
      <Spin size='large' />
    </Flex>
  )
}
