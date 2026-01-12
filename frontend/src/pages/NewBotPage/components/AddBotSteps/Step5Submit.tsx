import Button from '@app/mtb-ui/Button'
import { CreateMezonAppRequest } from '@app/services/api/mezonApp/mezonApp.types'
import { Result } from 'antd'
import { capitalize } from 'lodash'
import { useFormContext, useWatch } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const Step5Submit = ({
  isSuccess,
  isEdit,
  botId
}: {
  isSuccess: boolean
  isEdit: boolean
  botId?: string
}) => {
  const { t } = useTranslation(['new_bot_page'])
  const navigate = useNavigate()
  const { control } = useFormContext<CreateMezonAppRequest>()
  
  const type = useWatch({ control, name: 'type' })
  const formattedType = capitalize(type)

  if (isSuccess) {
    const title = isEdit 
      ? t('new_bot_page.step5.update_title', { type: formattedType })
      : t('new_bot_page.step5.success_title', { type: formattedType })
    const subTitle = isEdit
      ? t('new_bot_page.step5.update_subtitle', { type: formattedType })
      : t('new_bot_page.step5.success_subtitle', { type: formattedType })

    return (
      <>
        <Result
          status="success"
          title={<div className="text-primary">{title}</div>}
          subTitle={<div className="text-secondary">{subTitle}</div>}
          extra={[
            <Button color="default" variant='outlined' key="go-bot" onClick={() => navigate(`/bot/${botId}`)}>
              {isEdit ? t('new_bot_page.buttons.view_bot') : t('new_bot_page.buttons.go_bot')}
            </Button>,
            <Button color="default" variant='outlined' key="go-home" onClick={() => navigate('/')}>
              {t('new_bot_page.buttons.go_home')}
            </Button>
          ]}
        />
      </>
    )
  }

  return (
    <>
      <Result
        status="error"
        title={<div className="text-primary">{isEdit ? t('new_bot_page.step5.update_fail_title') : t('new_bot_page.step5.fail_title')}</div>}
        subTitle={<div className="text-secondary">{t('new_bot_page.step5.fail_subtitle')}</div>}
        extra={[
          <Button key="back" onClick={() => navigate(-1)}>
            {t('new_bot_page.buttons.go_back')}
          </Button>
        ]}
      />
    </>
  )
}

export default Step5Submit