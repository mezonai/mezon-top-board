import { Steps, Upload } from 'antd'
import Button from '@app/mtb-ui/Button'
import { useState, useEffect } from 'react'
import { useForm, FormProvider, useFormContext } from 'react-hook-form'
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

import Step1ChooseType from './components/AddBotSteps/Step1ChooseType'
import Step2ProvideID from './components/AddBotSteps/Step2ProvideID'
import Step3FillDetails from './components/AddBotSteps/Step3FillDetails'
import Step4Review from './components/AddBotSteps/Step4Review'
import Step5Submit from './components/AddBotSteps/Step5Submit'
import { MezonAppType } from '@app/enums/mezonAppType.enum'
import { useOnSubmitBotForm } from './hooks/useOnSubmitBotForm'

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
      type: MezonAppType.BOT,
      mezonAppId: '',
      name: '',
      headline: '',
      description: '',
      prefix: '',
      tagIds: [],
      pricingTag: 'FREE',
      price: 0,
      supportUrl: '',
      remark: '',
      isAutoPublished: false,
      socialLinks: []
    },
    resolver: yupResolver(ADD_BOT_SCHEMA),
    mode: 'onChange'
  })

  const { setValue, reset, watch, trigger, handleSubmit  } = methods
  const nameValue = watch('name')
  const headlineValue = watch('headline')

  const [getTagList] = useLazyTagControllerGetTagsQuery()
  const [getSocialLink] = useLazyLinkTypeControllerGetAllLinksQuery()
  const [uploadImage, { isLoading: isUpdatingAvatar }] = useMediaControllerCreateMediaMutation()
  const [getMezonAppDetails] = useLazyMezonAppControllerGetMezonAppDetailQuery()
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [submittedBotId, setSubmittedBotId] = useState<string>('')

  const isEditMode = Boolean(botId)

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

      reset({
        ...rest,
        tagIds: mezonAppDetail.tags?.map(tag => tag.id),
        mezonAppId: mezonAppDetail.mezonAppId,
        type: mezonAppDetail.type
      })
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
        setAvatar(getUrlMedia(response.data?.filePath))
        setValue('featuredImage', response.data?.filePath)
      }

      onSuccess(response, file)
      toast.success('Upload Success')
    } catch (error) {
      toast.error('Upload failed!')
      onError(error)
    }
  }
  const stepFieldMap: Record<number, (keyof CreateMezonAppRequest)[]> = {
    0: ['type'],
    1: ['mezonAppId'],
    2: ['name', 'headline', 'description', 'prefix', 'tagIds', 'pricingTag', 'price', 'supportUrl'],
    3: [],
    4: []
  }

  const next = async () => {
    const fieldsToValidate = stepFieldMap[currentStep] || []
    if (fieldsToValidate.length) {
      const valid = await trigger(fieldsToValidate as any)
      if (!valid) return
    }
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 0)
  }
  const prev = () => setCurrentStep((prev) => Math.max(prev - 1, 0))

  const createSteps = [
    { title: 'Choose Type', content: <Step1ChooseType/> },
    { title: 'Provide ID', content: <Step2ProvideID type={watch('type')}/> },
    { title: 'Fill Details', content: <Step3FillDetails /> },
    {
      title: 'Review',
      content: (<Step4Review isEdit={isEditMode}/>)
    },
    {
      title: 'Result',
      content: <Step5Submit isSuccess={submitStatus === 'success'} botId={submittedBotId} isEdit={false} />
    }
  ]

  const editSteps = [
    { title: 'Edit Bot Info', content: <Step3FillDetails /> },
    {
      title: 'Review',
      content: (<Step4Review isEdit={isEditMode}/>)
    },
    { title: 'Result', content: <Step5Submit isSuccess={submitStatus === 'success'} botId={submittedBotId} isEdit={true}/> }
  ]
  const steps = isEditMode ? editSteps : createSteps

  const [isSmallSteps, setIsSmallSteps] = useState(false)
  useEffect(() => {
    const updateSize = () => {
      const width = window.innerWidth
      setIsSmallSteps(width >= 576 && width < 1024)
    }

    updateSize()
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [])

  const onSubmit = useOnSubmitBotForm(
    isEditMode,
    (id) => {
      setSubmittedBotId(id)
      setSubmitStatus('success')
      setCurrentStep(isEditMode ? 2 : 4)
    },
    () => {
      setSubmitStatus('error')
      setCurrentStep(isEditMode ? 2 : 4)
    }
  )

  const SubmitForm = handleSubmit(onSubmit, (formErrors) => {
    toast.error('Form validation failed!')
  })
  
  return (
    <div className='pt-8 pb-12 w-[85%] m-auto'>
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
            <Steps labelPlacement={isSmallSteps ? 'vertical' : 'horizontal'} current={currentStep} items={steps.map(step => ({ title: step.title }))} />
            <div className='pt-6'>{steps[currentStep].content}</div>
            <div
              className={`flex pt-8 ${
                (!isEditMode && currentStep === 0) || (isEditMode && currentStep === 0)
                  ? 'justify-end'
                  : 'justify-between'
              }`}
            >
              {currentStep > 0 && currentStep !== (isEditMode ? 2 : 4) && (
                <Button color="default" variant="outlined" onClick={prev} >
                  Back
                </Button>
              )}
              
              {((!isEditMode && currentStep < 3) || (isEditMode && currentStep === 0)) && (
                <Button variant="outlined" onClick={next}>
                  Next
                </Button>
              )}

              {(currentStep === 3 && !isEditMode) && (
                <Button onClick={SubmitForm}>
                  Submit for Review
                </Button>
              )}

              {(currentStep === 1 && isEditMode) && (
                <Button onClick={SubmitForm}>
                  Update
                </Button>
              )}
            </div>
          </div>
        </FormProvider>
      </div>
    </div>
  )
}

export default NewBotPage
