import { toast } from 'react-toastify'
import { useParams } from 'react-router-dom'
import { useMezonAppControllerCreateMezonAppMutation, useMezonAppControllerUpdateMezonAppMutation, CreateMezonAppRequest, SocialLinkDto } from '@app/services/api/mezonApp/mezonApp'
import { useMediaControllerCreateMediaMutation } from '@app/services/api/media/media'
import dataURLtoFile from '@app/utils/file'
import { ApiError } from '@app/types/API.types'

export const useOnSubmitBotForm = (
  isEdit: boolean,
  onSuccess: (id: string) => void,
  onError: () => void
) => {
  const { botId } = useParams()
  const [uploadMedia] = useMediaControllerCreateMediaMutation()
  const [addBot] = useMezonAppControllerCreateMezonAppMutation()
  const [updateBot] = useMezonAppControllerUpdateMezonAppMutation()

  const onSubmit = async (formData: CreateMezonAppRequest) => {
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
        result.id && onSuccess(result.id)
      } else if (botId) {
        const result = await updateBot({
          updateMezonAppRequest: {
            ...payload,
            id: botId,
            mezonAppId: payload.mezonAppId === null ? undefined : payload.mezonAppId
          }
        }).unwrap()
        toast.success('Bot updated successfully!')
        result.id && onSuccess(result.id)
      }
    } catch (err: unknown) {
      const error = err as ApiError
      const message = Array.isArray(error?.data?.message)
        ? error.data.message.join('\n')
        : error?.data?.message || 'Something went wrong'
      toast.error(message)
      onError()
    }
  }

  return onSubmit
}
