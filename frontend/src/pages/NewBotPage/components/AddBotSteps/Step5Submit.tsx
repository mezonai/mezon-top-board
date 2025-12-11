import Button from '@app/mtb-ui/Button'
import { CreateMezonAppRequest } from '@app/services/api/mezonApp/mezonApp.types'
import { Result } from 'antd'
import { capitalize } from 'lodash'
import { useFormContext, useWatch } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

const Step5Submit = ({
  isSuccess,
  isEdit,
  botId
}: {
  isSuccess: boolean
  isEdit: boolean
  botId?: string
}) => {
  const navigate = useNavigate()
  const { control } = useFormContext<CreateMezonAppRequest>()
  
  const type = useWatch({ control, name: 'type' })
  const formattedType = capitalize(type)

  if (isSuccess) {
    const title = isEdit ? `${formattedType} updated successfully!` : `${formattedType} submitted successfully!`
    const subTitle = isEdit
      ? `Your ${formattedType} has been updated. You can now return to view it or go back to home.`
      : `Your ${formattedType} has been submitted for review. You can now view it or return to homepage.`

    return (
      <>
        <Result
          status="success"
          title={<div className="text-text-primary">{title}</div>}
          subTitle={<div className="text-text-secondary">{subTitle}</div>}
          extra={[
            <Button color="default" variant='outlined' key="go-bot" onClick={() => navigate(`/bot/${botId}`)}>
              {isEdit ? 'View Bot' : 'Go to Bot'}
            </Button>,
            <Button color="default" variant='outlined' key="go-home" onClick={() => navigate('/')}>
              Go Home
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
        title={<div className="text-text-primary">{isEdit ? 'Update Failed' : 'Submission Failed'}</div>}
        subTitle={<div className="text-text-secondary">Something went wrong. Please go back and check your input before trying again.</div>}
        extra={[
          <Button key="back" onClick={() => navigate(-1)}>
            Go Back
          </Button>
        ]}
      />
    </>
  )
}

export default Step5Submit