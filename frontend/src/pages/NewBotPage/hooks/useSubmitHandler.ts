import { useFormContext } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import {
  useMezonAppControllerCreateMezonAppMutation,
  useMezonAppControllerUpdateMezonAppMutation
} from '@app/services/api/mezonApp/mezonApp'
import { useMediaControllerCreateMediaMutation } from '@app/services/api/media/media'
import { CreateMezonAppRequest, SocialLinkDto } from '@app/services/api/mezonApp/mezonApp'
import { ApiError } from '@app/types/API.types'

const useSubmitHandler = (
  isEdit: boolean,
  callbacks?: { onSuccess?: (id: string) => void; onError?: () => void }
) => {
  const { handleSubmit } = useFormContext()
  const { botId } = useParams()

  const [uploadMedia] = useMediaControllerCreateMediaMutation()
  const [addBot] = useMezonAppControllerCreateMezonAppMutation()
  const [updateBot] = useMezonAppControllerUpdateMezonAppMutation()

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
        type: formData.type
      }

      if (!isEdit) {
        const result = await addBot({ createMezonAppRequest: payload }).unwrap()
        toast.success('Bot created successfully!')
        result.id && callbacks?.onSuccess?.(result.id)
      } else if (botId) {
        const updatePayload = {
          ...payload,
          id: botId,
          mezonAppId: payload.mezonAppId === null ? undefined : payload.mezonAppId
        }
        const result = await updateBot({ updateMezonAppRequest: updatePayload }).unwrap()
        toast.success('Bot updated successfully!')
        result.id && callbacks?.onSuccess?.(result.id)
      }
    } catch (err: unknown) {
      const error = err as ApiError
      const message = Array.isArray(error?.data?.message)
        ? error.data.message.join('\n')
        : error?.data?.message || 'Something went wrong'
      toast.error(message)
      callbacks?.onError?.()
    }
  }

  return handleSubmit(onSubmit, (formErrors) => {
    toast.error('Form validation failed.')
    callbacks?.onError?.()
  })
}

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

export default useSubmitHandler
