import Button from '@app/mtb-ui/Button'
import { Result } from 'antd'
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

  if (isSuccess) {
    const title = isEdit ? 'Bot updated successfully!' : 'Bot submitted successfully!'
    const subTitle = isEdit
      ? 'Your bot has been updated. You can now return to view it or go back to home.'
      : 'Your bot has been submitted for review. You can now view it or return to homepage.'

    return (
      <Result
        status="success"
        title={title}
        subTitle={subTitle}
        extra={[
          <Button color="default" variant='outlined' key="go-bot" onClick={() => navigate(`/bot/${botId}`)}>
            {isEdit ? 'View Bot' : 'Go to Bot'}
          </Button>,
          <Button color="default" variant='outlined' key="go-home" onClick={() => navigate('/')}>
            Go Home
          </Button>
        ]}
      />
    )
  }

  return (
    <Result
      status="error"
      title={isEdit ? 'Update Failed' : 'Submission Failed'}
      subTitle="Something went wrong. Please go back and check your input before trying again."
      extra={[
        <Button key="back" onClick={() => navigate(-1)}>
          Go Back
        </Button>
      ]}
    />
  )
}

export default Step5Submit
