import avatar from '@app/assets/images/default-user.webp'
import Button from '@app/mtb-ui/Button'
import MtbRate from '@app/mtb-ui/Rate/Rate'
import MtbTypography from '@app/mtb-ui/Typography/Typography'
import { useRatingControllerCreateRatingMutation } from '@app/services/api/rating/rating'
import { CreateRatingRequest } from '@app/services/api/rating/rating.types'
import { RootState } from '@app/store'
import { useAppSelector } from '@app/store/hook'
import { IUserStore } from '@app/store/user'
import { Form, Input } from 'antd'
import { Controller, useForm } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { RatingFormProps } from './RatingForm.types'
import { getUrlMedia } from '@app/utils/stringHelper'

const RatingForm = ({ onSubmitted }: RatingFormProps) => {
  const { botId: appId } = useParams<string>()
  const { userInfo } = useAppSelector<RootState, IUserStore>((s) => s.user)
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      comment: '',
      score: 0
    }
  })
  const [createRating] = useRatingControllerCreateRatingMutation()

  const onSubmit = async (data: Omit<CreateRatingRequest, "appId">) => {
    try {
      if (!appId) throw new Error("Bad Request!")
      await createRating({ createRatingRequest: { ...data, appId } }).unwrap()
      if (onSubmitted) onSubmitted(data)
      toast.success('Successfully')
      reset()
    } catch (error: any) {
      if (!Array.isArray(error.data.message)) toast.error(error.data.message)
      else toast.error(error.data.message[0])
    }
  }

  return (
    <div className='flex items-start gap-8 p-4 rounded-lg bg-container border border-transparent dark:border-border'>
      <img
        src={userInfo?.profileImage ? getUrlMedia(userInfo?.profileImage) : avatar}
        alt={userInfo.name}
        className='w-15 h-15 rounded-full object-cover mt-1 bg-container-secondary'
      />

      <div className='flex-1 flex flex-col gap-2 mt-4'>
        <MtbTypography variant='h4' customClassName='!text-primary'>
          {userInfo.name}
        </MtbTypography>
        
        <Form onFinish={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
          <Controller
            name="score"
            control={control}
            render={({ field }) => <MtbRate {...field} />}
          />
          <Controller
            name="comment"
            control={control}
            render={({ field }) => (
              <Input.TextArea
                {...field}
                rows={3}
                placeholder='Write your comment...'
                className='rounded-md mt-3 !bg-container !text-primary !border-border dark:!border-border focus:!border-primary focus:!ring-primary placeholder:!text-secondary'
              />
            )}
          />

          <Button htmlType='submit' customClassName='self-start bg-primary hover:bg-primary/90 text-white rounded-md px-4 py-2' size='large'>
            Post Rating
          </Button>
        </Form>
      </div>
    </div>
  )
}

export default RatingForm