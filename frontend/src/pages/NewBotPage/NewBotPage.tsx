import { Steps } from 'antd'
import Button from '@app/mtb-ui/Button'
import { useState, useEffect, useMemo } from 'react'
import { useForm, FormProvider, FieldPath } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'

import MTBAvatar from '@app/mtb-ui/Avatar/MTBAvatar'
import MtbTypography from '@app/mtb-ui/Typography/Typography'
import useAuthRedirect from '@app/hook/useAuthRedirect'
import useOwnershipCheck from '@app/hook/useOwnershipCheck'
import { avatarBotDefault } from '@app/assets'
import { getUrlMedia } from '@app/utils/stringHelper'

import { ADD_BOT_SCHEMA } from '@app/validations/addBot.validations'
import {
  useLazyMezonAppControllerGetMezonAppDetailQuery,
} from '@app/services/api/mezonApp/mezonApp'
import { CreateMezonAppRequest } from '@app/services/api/mezonApp/mezonApp.types'
import { useLazyTagControllerGetTagsQuery } from '@app/services/api/tag/tag'
import { useLazyLinkTypeControllerGetAllLinksQuery } from '@app/services/api/linkType/linkType'
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
import MediaManagerModal from '@app/components/MediaManager/MediaManager'
import { AppPricing } from '@app/enums/appPricing'
import { mapDetailToFormData } from './helpers'
import { IUserStore } from '@app/store/user'

type StepFieldMap = { [key: number]: FieldPath<CreateMezonAppRequest>[] }

function NewBotPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const { mezonAppDetail } = useSelector<RootState, IMezonAppStore>((s) => s.mezonApp)
  const { tagList } = useSelector<RootState, ITagStore>((s) => s.tag)
  const { userInfo } = useSelector<RootState, IUserStore>((s) => s.user)
  const { botId } = useParams()
  const { checkOwnership } = useOwnershipCheck()
  const [isModalVisible, setIsModalVisible] = useState(false)

  const methods = useForm<CreateMezonAppRequest>({
    defaultValues: {
      type: MezonAppType.BOT,
      mezonAppId: '',
      name: '',
      headline: '',
      description: '',
      prefix: '',
      featuredImage: '',
      tagIds: [],
      pricingTag: AppPricing.FREE,
      price: 0,
      supportUrl: '',
      remark: '',
      //TODO: isAutoPublished will be implemented later
      isAutoPublished: true,
      socialLinks: []
    },
    resolver: yupResolver(ADD_BOT_SCHEMA),
    mode: 'onChange'
  })

  const { setValue, reset, watch, trigger, handleSubmit } = methods
  const nameValue = watch('name')
  const headlineValue = watch('headline')
  const featuredImageValue = watch('featuredImage')

  const imgUrl = useMemo(() => {
    return botId && featuredImageValue
      ? getUrlMedia(featuredImageValue)
      : avatarBotDefault
  }, [botId, featuredImageValue])
  const [avatar, setAvatar] = useState<string>(imgUrl)
  const [getTagList] = useLazyTagControllerGetTagsQuery()
  const [getSocialLink] = useLazyLinkTypeControllerGetAllLinksQuery()
  const [getMezonAppDetails] = useLazyMezonAppControllerGetMezonAppDetailQuery()
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [submittedBotId, setSubmittedBotId] = useState<string>('')

  const isEditMode = Boolean(botId)

  useAuthRedirect()

  useEffect(() => {
    if (isEmpty(tagList.data)) getTagList()
    getSocialLink()
  }, [getTagList, getSocialLink, tagList.data])

  useEffect(() => {
    if (!botId) {
      reset()
      return
    }
    getMezonAppDetails({ id: botId })
  }, [botId, getMezonAppDetails, reset])

  useEffect(() => {
    setAvatar(imgUrl)
  }, [imgUrl])

  useEffect(() => {
    if (!mezonAppDetail.id || !botId) return;

    if (!userInfo?.id) return;

    if (!checkOwnership(mezonAppDetail.owner?.id)) return;

    const formData = mapDetailToFormData(mezonAppDetail);
    reset(formData);
  }, [mezonAppDetail.id, botId, userInfo?.id, reset]);

  const handleModalCancel = () => {
    setIsModalVisible(false)
  }

  const handleAvatarClick = () => {
    setIsModalVisible(true)
  }

  const handleMediaSelect = async (selection: string) => {
    setIsModalVisible(false);
    if (selection) {
      setValue('featuredImage', selection)
      setAvatar(getUrlMedia(selection))
    } else {
      toast.error('No image selected')
    }
  }

  const step3FillDetailsFields: FieldPath<CreateMezonAppRequest>[] = [
    'name',
    'headline',
    'description',
    'prefix',
    'tagIds',
    'pricingTag',
    'price',
    'supportUrl',
    'featuredImage',
    'socialLinks',
    'remark',
    'isAutoPublished'
  ]

  const stepFieldMap = useMemo((): StepFieldMap => {
    if (isEditMode) {
      return {
        0: step3FillDetailsFields,
        1: [],
        2: []
      }
    }
    return {
      0: ['type'],
      1: ['mezonAppId'],
      2: step3FillDetailsFields,
      3: [],
      4: []
    }

  }, [isEditMode, step3FillDetailsFields])

  const next = async () => {
    const fieldsToValidate = stepFieldMap[currentStep] || []
    if (fieldsToValidate.length) {
      const valid = await trigger(fieldsToValidate)
      if (!valid) return
    }
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 0)
  }
  const prev = () => setCurrentStep((prev) => Math.max(prev - 1, 0))

  const createSteps = [
    { title: 'Choose Type', content: <Step1ChooseType /> },
    { title: 'Provide ID', content: <Step2ProvideID type={watch('type')} /> },
    { title: 'Fill Details', content: <Step3FillDetails isEdit={false} /> },
    {
      title: 'Review',
      content: (<Step4Review isEdit={isEditMode} />)
    },
    {
      title: 'Result',
      content: <Step5Submit isSuccess={submitStatus === 'success'} botId={submittedBotId} isEdit={false} />
    }
  ]

  const editSteps = [
    { title: 'Edit Bot Info', content: <Step3FillDetails isEdit={true} /> },
    {
      title: 'Review',
      content: (<Step4Review isEdit={isEditMode} />)
    },
    { title: 'Result', content: <Step5Submit isSuccess={submitStatus === 'success'} botId={submittedBotId} isEdit={true} /> }
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

  const SubmitForm = handleSubmit(onSubmit, () => {
    toast.error('Form validation failed!')
  })

  return (
    <div className='pt-8 pb-12 w-[85%] m-auto'>
      <div className='flex items-center justify-between'>
        <div className='flex gap-6'>
          <div className='w-[80px] object-cover flex-shrink-0'>
            <div onClick={handleAvatarClick} style={{ cursor: 'pointer' }}>
              <MTBAvatar imgUrl={avatar} isAllowUpdate={true} />
            </div>
            <MediaManagerModal
              isVisible={isModalVisible}
              onChoose={handleMediaSelect}
              onClose={handleModalCancel}
            />
          </div>
          <div>
            <MtbTypography variant='h4' customClassName='text-text-primary'>{nameValue || 'Name'}</MtbTypography>
            <MtbTypography variant='p' customClassName='text-text-secondary'>{headlineValue || 'Headline (Short description)'}</MtbTypography>
          </div>
        </div>
      </div>

      <div className='pt-8'>
        <FormProvider {...methods}>
          <div className='bg-bg-container p-6 rounded-md shadow-md border border-transparent dark:border-border'>
            <Steps
              labelPlacement={isSmallSteps ? 'vertical' : 'horizontal'}
              current={currentStep}
              items={steps.map((step, idx) => ({
                title: (
                  <span className={idx <= currentStep ? 'text-text-primary' : 'text-text-secondary'}>
                    {step.title}
                  </span>
                )
              }))}
            />

            <div className='pt-6'>{steps[currentStep].content}</div>

            <div className={`flex pt-8 ${((!isEditMode && currentStep === 0) || (isEditMode && currentStep === 0)) ? 'justify-end' : 'justify-between'}`}>
              {currentStep > 0 && currentStep !== (isEditMode ? 2 : 4) && (
                <Button color="default" variant="outlined" onClick={prev} >
                  Back
                </Button>
              )}

              {((!isEditMode && currentStep < 3) || (isEditMode && currentStep === 0)) && (
                <Button variant='outlined' onClick={next}>
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