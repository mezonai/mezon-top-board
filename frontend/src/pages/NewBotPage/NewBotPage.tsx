import { Steps, Button, Upload } from 'antd'
import { useState, useEffect } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'

import MTBAvatar from '@app/mtb-ui/Avatar/MTBAvatar'
import MtbTypography from '@app/mtb-ui/Typography/Typography'
import useAuthRedirect from '@app/hook/useAuthRedirect'
import useOwnershipCheck from '@app/hook/useOwnershipCheck'
import { imageMimeTypes } from '@app/constants/mimeTypes'
import { avatarBotDefault } from '@app/assets'
import { getUrlMedia } from '@app/utils/stringHelper'

import { ADD_BOT_SCHEMA } from '@app/validations/addBot.validations'
import { CreateMezonAppRequest, useLazyMezonAppControllerGetMezonAppDetailQuery } from '@app/services/api/mezonApp/mezonApp'
import { useLazyTagControllerGetTagsQuery } from '@app/services/api/tag/tag'
import { useLazyLinkTypeControllerGetAllLinksQuery } from '@app/services/api/linkType/linkType'
import { useMediaControllerCreateMediaMutation } from '@app/services/api/media/media'
import { RootState } from '@app/store'
import { IMezonAppStore } from '@app/store/mezonApp'
import { ITagStore } from '@app/store/tag'
import { isEmpty } from 'lodash'

import { Step1ChooseType } from './components/AddBotSteps/Step1ChooseType'
import Step2ProvideID from './components/AddBotSteps/Step2ProvideID'
import Step3FillDetails from './components/AddBotSteps/Step3FillDetails'
import Step4Review from './components/AddBotSteps/Step4Review'
import Step5Submit from './components/AddBotSteps/Step5Submit'

function NewBotPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const { mezonAppDetail } = useSelector<RootState, IMezonAppStore>((s) => s.mezonApp)
  const { tagList } = useSelector<RootState, ITagStore>((s) => s.tag)
  const { botId } = useParams()
  const { checkOwnership } = useOwnershipCheck()

  const imgUrl = botId && mezonAppDetail.featuredImage
    ? getUrlMedia(mezonAppDetail.featuredImage)
    : avatarBotDefault
  const [avatar, setAvatar] = useState<string>(imgUrl)

  const methods = useForm<CreateMezonAppRequest>({
    defaultValues: {
      type: 'bot',
      botId: '',
      name: '',
      headline: '',
      description: '',
      installLink: '',
      prefix: '',
      tagIds: [],
      supportUrl: '',
      remark: '',
      isAutoPublished: false,
      socialLinks: []
    },
    resolver: yupResolver(ADD_BOT_SCHEMA),
    mode: 'onChange'
  })

  const { setValue, reset, watch, handleSubmit ,trigger  } = methods
  const nameValue = watch('name')
  const headlineValue = watch('headline')

  const [getTagList] = useLazyTagControllerGetTagsQuery()
  const [getSocialLink] = useLazyLinkTypeControllerGetAllLinksQuery()
  const [uploadImage, { isLoading: isUpdatingAvatar }] = useMediaControllerCreateMediaMutation()
  const [getMezonAppDetails] = useLazyMezonAppControllerGetMezonAppDetailQuery()

  useAuthRedirect()

  useEffect(() => {
    if (isEmpty(tagList.data)) getTagList()
    getSocialLink()
  }, [])

  useEffect(() => {
    if (!botId) {
      reset()
      return
    }
    getMezonAppDetails({ id: botId })
  }, [botId])

  useEffect(() => {
    const { owner, tags, rateScore, featuredImage, status, ...rest } = mezonAppDetail
    if (mezonAppDetail && botId) {
      if (!checkOwnership(mezonAppDetail?.owner?.id)) {
        return;
      }

      reset({ ...rest, tagIds: tags?.map(tag => tag.id) })
    }
    setAvatar(imgUrl)
  }, [mezonAppDetail])

  const handleUpload = async (options: any) => {
    const { file, onSuccess, onError } = options
    if (!imageMimeTypes.includes(file.type)) {
      toast.error('Please upload a valid image file!');
      onError(new Error('Invalid file type'));
      return;
    }
    const maxFileSize = 4 * 1024 * 1024
    if (file.size > maxFileSize) {
      toast.error(`${file.name} file upload failed (exceeds 4MB)`);
      return ;
    }
    try {
      const formData = new FormData()
      formData.append('file', file)
      const response = await uploadImage(formData).unwrap()

      if (response?.statusCode === 200) {
        setAvatar(getUrlMedia(response.data.filePath))
        setValue('featuredImage', response.data.filePath)
      }

      onSuccess(response, file)
      toast.success('Upload Success')
    } catch (error) {
      toast.error('Upload failed!')
      onError(error)
    }
  }
  const stepFieldMap: Record<number, (keyof AddBotFormValues)[]> = {
    0: ['type'],
    1: ['botId'],
    2: ['name', 'headline', 'description', 'installLink', 'prefix', 'tagIds', 'supportUrl'],
    3: [], // review step – không cần validate
    4: []  // submit step – handled in submit logic
  }


  const next = async () => {
    const fieldsToValidate = stepFieldMap[currentStep] || []
    if (fieldsToValidate.length) {
      const valid = await trigger(fieldsToValidate as any)
      if (!valid) return
    }
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
  }
  const prev = () => setCurrentStep((prev) => Math.max(prev - 1, 0))

  const steps = [
    { title: 'Choose Type', content: <Step1ChooseType onNext={next} /> },
    { title: 'Provide ID', content: <Step2ProvideID onNext={next} /> },
    { title: 'Fill Details', content: <Step3FillDetails /> },
    { title: 'Review', content: <Step4Review /> },
    { title: 'Submit', content: <Step5Submit isEdit={Boolean(botId)} /> }
  ]
  return (
    <div className='pt-8 pb-12 w-[85%] sm:w-[75%] m-auto'>
      <div className='flex items-center justify-between'>
        <div className='flex gap-6'>
          <div className='w-[80px] object-cover flex-shrink-0'>
            <Upload accept={imageMimeTypes.join(',')} customRequest={handleUpload} showUploadList={false}>
              <MTBAvatar imgUrl={avatar} isAllowUpdate={true} isUpdatingAvatar={isUpdatingAvatar} />
            </Upload>
          </div>
          <div>
            <MtbTypography variant='h4'>{nameValue || 'Name'}</MtbTypography>
            <MtbTypography variant='p'>{headlineValue || 'Headline (Short description)'}</MtbTypography>
          </div>
        </div>
      </div>

      <div className='pt-8'>
        <FormProvider {...methods}>
          <div className='bg-white p-6 rounded-md shadow-md'>
            <Steps current={currentStep} items={steps.map(step => ({ title: step.title }))} />
            <div className='pt-6'>{steps[currentStep].content}</div>

            <div className='flex justify-between pt-8'>
              {currentStep > 0 && <Button onClick={prev}>Back</Button>}
              {currentStep < steps.length - 1 && <Button type='primary' onClick={next}>Next</Button>}
            </div>
          </div>
        </FormProvider>
      </div>
    </div>
  )
}

export default NewBotPage
