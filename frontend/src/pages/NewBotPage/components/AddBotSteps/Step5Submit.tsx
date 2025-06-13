import { useFormContext } from 'react-hook-form'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Button } from 'antd'

import {
  useMezonAppControllerCreateMezonAppMutation,
  useMezonAppControllerUpdateMezonAppMutation
} from '@app/services/api/mezonApp/mezonApp'
import { useMediaControllerCreateMediaMutation } from '@app/services/api/media/media'
import { CreateMezonAppRequest, SocialLinkDto } from '@app/services/api/mezonApp/mezonApp'
import { ApiError } from '@app/types/API.types'

const Step5Submit = ({ isEdit }: { isEdit: boolean }) => {
  const { handleSubmit, getValues } = useFormContext()
  const navigate = useNavigate()
  const { botId } = useParams()

  const [uploadMedia] = useMediaControllerCreateMediaMutation()
  const [addBot, { isLoading: isCreating }] = useMezonAppControllerCreateMezonAppMutation()
  const [updateBot, { isLoading: isUpdating }] = useMezonAppControllerUpdateMezonAppMutation()

  const onSubmit = async (formData: any) => {
    try {
      const parser = new DOMParser()
      const doc = parser.parseFromString(formData.description || '', 'text/html')
      const imgs = doc.querySelectorAll('img')

      await Promise.all(
        Array.from(imgs).map(async (img, index) => {
          const src = img.getAttribute('src')
          if (src?.startsWith('data:image')) {
            const file = dataURLtoFile(src, `image-${index}.png`)
            const formDataImg = new FormData()
            formDataImg.append('file', file)

            const response = await uploadMedia(formDataImg).unwrap()
            const newUrl = response?.data?.filePath
            if (newUrl) img.setAttribute('src', newUrl)
          }
        })
      )

      const updatedDescription = doc.body.innerHTML

      const formattedLinks: SocialLinkDto[] = (formData.socialLinks || []).map((link: any) => ({
        url: link.url,
        linkTypeId: link.linkTypeId
      }))

      const payload: CreateMezonAppRequest = {
        ...formData,
        description: updatedDescription,
        socialLinks: formattedLinks,
        mezonAppId: formData.mezonAppId,
        type: formData.type,
      }

      if (!isEdit) {
        const result = await addBot({ createMezonAppRequest: payload }).unwrap()
        toast.success('Bot created successfully!')
        navigate(`/bot/${result.id}`)
      } else if (botId) {
        const updatePayload = {
          ...payload,
          id: botId
        }
        const result = await updateBot({ updateMezonAppRequest: updatePayload }).unwrap()
        toast.success('Bot updated successfully!')
        navigate(`/bot/${result.id}`)
      }
    } catch (err: unknown) {
      const error = err as ApiError
      const message = Array.isArray(error?.data?.message)
        ? error.data.message.join('\n')
        : error?.data?.message || 'Something went wrong'
      toast.error(message)
    }
  }

  return (
    <div className='text-right'>
      <Button
        type='primary'
        loading={isCreating || isUpdating}
        onClick={handleSubmit(onSubmit)}
      >
        Submit for Review
      </Button>
    </div>
  )
}

export default Step5Submit

function dataURLtoFile(dataurl: string, filename = 'image.png'): File {
  const arr = dataurl.split(',')
  const mime = arr[0].match(/:(.*?);/)?.[1]
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }

  return new File([u8arr], filename, { type: mime })
}
