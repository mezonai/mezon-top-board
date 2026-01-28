import { toast } from 'react-toastify'
import { useParams } from 'react-router-dom'
import { useMezonAppControllerCreateMezonAppMutation, useMezonAppControllerUpdateMezonAppMutation } from '@app/services/api/mezonApp/mezonApp'
import { CreateMezonAppRequest } from '@app/services/api/mezonApp/mezonApp.types'
import { SocialLink } from '@app/types'
import { useMediaControllerCreateMediaMutation } from '@app/services/api/media/media'
import dataURLtoFile from '@app/utils/file'
import { ApiError } from '@app/types/API.types'

import { useTranslation } from 'react-i18next'

export const useOnSubmitBotForm = (
  isEdit: boolean,
  onSuccess: (id: string) => void,
  onError: () => void
) => {
  const { t } = useTranslation(['common'])
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
      const formattedLinks: SocialLink[] = (formData.socialLinks || []).map((link) => ({
        url: link?.url,
        linkTypeId: link.linkTypeId
      }))

      const payload: CreateMezonAppRequest = {
        ...formData,
        price: Number(formData.price),
        description: updatedDescription,
        socialLinks: formattedLinks,
        mezonAppId: formData.mezonAppId,
        type: formData.type
      }

      if (!isEdit) {
        if ('changelog' in payload) delete payload.changelog;

        const result = await addBot({ createMezonAppRequest: payload }).unwrap()
        toast.success(t('hooks.submit_success_created', { type: formData.type }))
        result.id && onSuccess(result.id)
      } else if (botId) {
        const result = await updateBot({
          updateMezonAppRequest: {
            ...payload,
            id: botId,
            changelog: payload.changelog || '' 
          }
        }).unwrap()
        toast.success(t('hooks.submit_success_updated', { type: formData.type }))
        result.id && onSuccess(result.id)
      }
    } catch (err: unknown) {
      const error = err as ApiError
      const message = Array.isArray(error?.data?.message)
        ? error.data.message.join('\n')
        : error?.data?.message || t('hooks.generic_error')
      toast.error(message)
      onError()
    }
  }

  return onSubmit
}