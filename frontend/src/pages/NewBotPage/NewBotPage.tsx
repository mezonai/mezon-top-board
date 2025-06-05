import { avatarBotDefault } from '@app/assets'
import useAuthRedirect from '@app/hook/useAuthRedirect'
import MTBAvatar from '@app/mtb-ui/Avatar/MTBAvatar'
import MtbTypography from '@app/mtb-ui/Typography/Typography'
import { useLazyLinkTypeControllerGetAllLinksQuery } from '@app/services/api/linkType/linkType'
import { CreateMezonAppRequest } from '@app/services/api/mezonApp/mezonApp.types'
import { useMediaControllerCreateMediaMutation } from '@app/services/api/media/media'
import { useLazyMezonAppControllerGetMezonAppDetailQuery } from '@app/services/api/mezonApp/mezonApp'
import { useLazyTagControllerGetTagsQuery } from '@app/services/api/tag/tag'
import { RootState } from '@app/store'
import { IMezonAppStore } from '@app/store/mezonApp'
import { ITagStore } from '@app/store/tag'
import { getUrlMedia } from '@app/utils/stringHelper'
import { ADD_BOT_SCHEMA } from '@app/validations/addBot.validations'
import { yupResolver } from '@hookform/resolvers/yup'
import { Upload } from 'antd'
import { isEmpty } from 'lodash'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import AddBotForm from './components/AddBotForm/AddBotForm'
import useOwnershipCheck from '@app/hook/useOwnershipCheck'
import { imageMimeTypes } from '@app/constants/mimeTypes'

function NewBotPage() {
  const { mezonAppDetail } = useSelector<RootState, IMezonAppStore>((s) => s.mezonApp)
  const { tagList } = useSelector<RootState, ITagStore>((s) => s.tag)
  const { botId } = useParams()
  const { checkOwnership } = useOwnershipCheck();
  const imgUrl = botId && mezonAppDetail.featuredImage ? getUrlMedia(mezonAppDetail.featuredImage) : avatarBotDefault
  const [avatar, setAvatar] = useState<string>(imgUrl)
  const methods = useForm<CreateMezonAppRequest>({
    defaultValues: {
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
  })

  const { setValue, reset } = methods
  const nameValue = methods.watch("name");
  const headlineValue = methods.watch("headline");

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
        setAvatar(getUrlMedia(response?.data?.filePath))
        setValue('featuredImage', response?.data?.filePath)
      }

      onSuccess(response, file)
      toast.success('Upload Success')
    } catch (error) {
      toast.error('Upload failed!')
      onError(error)
    }
  }

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
            <MtbTypography variant='h4'>{nameValue || "Name"}</MtbTypography>
            <MtbTypography variant='p'>{headlineValue || 'Headline (Short description)'}</MtbTypography>
          </div>
        </div>
      </div>
      <div className='pt-8'>
        <FormProvider {...methods}>
          <AddBotForm isEdit={Boolean(botId)}></AddBotForm>
        </FormProvider>
      </div>
    </div>
  )
}

export default NewBotPage
