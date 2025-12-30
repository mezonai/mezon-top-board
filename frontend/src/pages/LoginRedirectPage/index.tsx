import { useAuth } from '@app/hook/useAuth'
import { useAuthControllerVerifyOAuth2Mutation } from '@app/services/api/auth/auth'
import { storeAccessTokens } from '@app/utils/storage'
import { Flex, Spin } from 'antd'
import { useEffect, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useLazyUserControllerGetUserDetailsQuery } from '@app/services/api/user/user'
import { useTranslation } from 'react-i18next'

export const LoginRedirectPage = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { t } = useTranslation()
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
      toast.error(t('login_redirect.fail_generic'))
      navigate('/')
      return
    }

    try {
      const { data } = await verifyOauth2Service({ oAuth2Request: { code, scope: scope || 'openid' } })
      if (!data) {
        toast.error(t('login_redirect.fail'))
        navigate('/', { replace: true })
        return
      }
      storeAccessTokens(data.data)
      postLogin()

      const userResp = await getUserInfo().unwrap().catch(() => null)

      const isFirstLogin = !!userResp?.data?.isFirstLogin
      toast.success(t('login_redirect.success'))
      navigate(isFirstLogin ? '/welcome' : '/', { replace: true })
    } catch (_) {
      toast.error(t('login_redirect.fail'))
      navigate('/', { replace: true })
    }
  }

  useEffect(() => {
    handleOAuthLogin()
  }, [urlParams])

  return (
    <Flex align='center' justify='center' vertical flex={1} className='fixed inset-0 z-[9999] bg-content'>
      <Spin size='large' />
    </Flex>
  )
}
