import FormField from '@app/components/FormField/FormField'
import RichTextEditor from '@app/components/RichText/RichText'
import { errorStatus } from '@app/constants/common.constant'
import Button from '@app/mtb-ui/Button'
import { ImgIcon } from '@app/mtb-ui/ImgIcon/ImgIcon'
import MtbTypography from '@app/mtb-ui/Typography/Typography'
import { useMediaControllerCreateMediaMutation } from '@app/services/api/media/media'
import {
  CreateMezonAppRequest,
  useMezonAppControllerCreateMezonAppMutation,
  useMezonAppControllerUpdateMezonAppMutation
} from '@app/services/api/mezonApp/mezonApp'
import { RootState } from '@app/store'
import { ILinkTypeStore } from '@app/store/linkType'
import { ITagStore } from '@app/store/tag'
import { ApiError } from '@app/types/API.types'
import { IAddBotFormProps } from '@app/components/BotCard/BotCard.types'
import { Checkbox, Form, Input, Select, TagProps } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import { useEffect, useMemo, useState } from 'react'
import { Controller, useFieldArray, useFormContext } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

const SocialLinkIcon = ({ src, prefixUrl }: { src?: string; prefixUrl?: string }) => {
  return (
    <div className='flex items-center gap-2'>
      <ImgIcon src={src || ''} width={17} /> {prefixUrl}
    </div>
  )
}

function AddBotForm({ isEdit }: IAddBotFormProps) {
  const {
    control,
    setError,
    handleSubmit,
    clearErrors,
    setValue,
    formState: { errors }
  } = useFormContext<CreateMezonAppRequest>()
  const [addBot] = useMezonAppControllerCreateMezonAppMutation()
  const navigate = useNavigate()
  const [updateBot, { isLoading: isUpdating }] = useMezonAppControllerUpdateMezonAppMutation()
  const { tagList } = useSelector<RootState, ITagStore>((s) => s.tag)
  const { linkTypeList } = useSelector<RootState, ILinkTypeStore>((s) => s.link)
  const [selectedSocialLink, setSelectedSocialLink] = useState<string>('') // holds selected link type id
  const {
    fields: socialLinksData,
    append,
    remove,
    update
  } = useFieldArray({
    control,
    name: 'socialLinks'
  })
  const [socialLinkUrl, setSocialLinkUrl] = useState<string>('')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [uploadMedia] = useMediaControllerCreateMediaMutation()

  const [addLinkError, setAddLinkError] = useState<string | null>(null);  

  const { botId } = useParams()

  function dataURLtoFile(dataurl: string, filename = 'image.png') {
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

  const onSubmit = async (data: CreateMezonAppRequest) => {
    try {
      const parser = new DOMParser()
      const doc = parser.parseFromString(data.description || '', 'text/html')
      const imgs = doc.querySelectorAll('img')
      await Promise.all(
        Array.from(imgs).map(async (img, index) => {
          const src = img.getAttribute('src')
          if (src?.startsWith('data:image')) {
            const file = dataURLtoFile(src, `image-${index}.png`)
            const formData = new FormData()
            formData.append('file', file)

            const response = await uploadMedia(formData).unwrap()
            const newUrl = response?.data?.filePath
            if (newUrl) {
              img.setAttribute('src', newUrl)
            }
          }
        })
      )

      const updatedDescription = doc.body.innerHTML
      data.description = updatedDescription

      const formattedSocialLinks = socialLinksData.map((link) => {
        const selectedLink = optionsLink?.find((item) => item.value === link.linkTypeId)
        if (!selectedLink) return link
        return {
          url: link.url,
          linkTypeId: selectedLink.value
        }
      })

      const { ...restData } = data

      const addBotData = {
        ...restData,
        socialLinks: formattedSocialLinks
      }

      if (!isEdit && !botId) {
        const response = await addBot({ createMezonAppRequest: addBotData }).unwrap()
        toast.success('Add new bot success')
        if (response.id) {
          navigate(`/bot/${response.id}`)
        }
        return
      }

      if (!botId) return

      const updateResponse = await updateBot({ updateMezonAppRequest: { ...data, id: botId, socialLinks: formattedSocialLinks } }).unwrap();
      if (updateResponse?.id) {
        navigate(`/bot/${ updateResponse?.id}`)
      }

      toast.success('Edit bot success')
    } catch (error: unknown) {
      const err = error as ApiError
      const message =
        err?.data?.message && Array.isArray(err.data.message)
          ? err.data.message.join('\n')
          : err?.data?.message || 'Something went wrong'
      toast.error(message)
    }
  }

  const options = useMemo(() => {
    return tagList?.data?.map((tag) => ({
      label: tag.name,
      value: tag.id
    }))
  }, [tagList])

  const tagRender = (props: TagProps & { label?: string }) => {
    const { label, closable, onClose } = props

    return (
      <div className={`px-2 rounded-md inline-flex items-center mr-2 text-black capitalize !bg-gray-300`}>
        <span>{label}</span>
        {closable && (
          <span onClick={onClose} className='ml-2 cursor-pointer font-bold'>
            ×
          </span>
        )}
      </div>
    )
  }

  const optionsLink = useMemo(() => {
    return linkTypeList?.data?.map((item) => ({
      icon: item.icon,
      label: <SocialLinkIcon src={item?.icon} prefixUrl={item?.name} />,
      name: item.name,
      value: item.id,
      siteName: item.prefixUrl
    }))
  }, [linkTypeList])

  const addNewLink = () => {
    // if (not selectedSocialLink or socialLinkUrl not valid) then return
    const trimmedUrl = socialLinkUrl.trim()
    if (!selectedSocialLink || !trimmedUrl) return

    const isDuplicate = socialLinksData.some(
      (link) =>
        link.url?.trim() === trimmedUrl &&
        link.linkTypeId === selectedSocialLink
    );

    if (isDuplicate) {
      setAddLinkError("This link already exists.");
      return;
    }

    setAddLinkError(null);

    // get selectedLink in optionsLink
    const selectedLink = optionsLink?.find((item) => item.value === selectedSocialLink)
    if (!selectedLink) return

    const newLink = {
      icon: selectedLink.icon,
      url: trimmedUrl,
      linkTypeId: selectedLink?.value,
      type: {
        id: selectedLink?.value,
        name: selectedLink?.name,
        prefixUrl: selectedLink?.siteName,
        icon: selectedLink?.icon
      }
    }
    // add new links to the links list
    append(newLink)
    setSocialLinkUrl('')
    setSelectedSocialLink('')
  }

  const handleSocialLinkUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSocialLinkUrl(e.target.value)
  }
  
  useEffect(() => {
    const seen = new Map<string, number[]>();

    socialLinksData.forEach((link, index) => {
      const url = link.url?.trim();
      const linkTypeId = link.linkTypeId;

      if (!url || !linkTypeId) return;

      const key = `${linkTypeId}_${url}`;
      const indexes = seen.get(key) || [];
      indexes.push(index);
      seen.set(key, indexes);
    });

    seen.forEach((indexes) => {
      if (indexes.length > 1) {
        indexes.forEach((i) => {
          setError(`socialLinks.${i}.url`, {
            type: 'duplicate',
            message: 'This link is duplicated.',
          });
        });
      } else {
        clearErrors(`socialLinks.${indexes[0]}.url`);
      }
    });
  }, [socialLinksData, setError, clearErrors]);


  return (
    <div className='shadow-md p-6 sm:p-8 rounded-md bg-white'>
      <Form layout='vertical' onFinish={handleSubmit(onSubmit)} className='overflow-hidden'>
        <MtbTypography variant='h4'>Your Bot Detail</MtbTypography>
        <FormField label='Name' description='Name your bot' errorText={errors.name?.message}>
          <Controller
            control={control}
            name='name'
            render={({ field }) => <Input {...field} placeholder='MezonBot' status={errorStatus(errors.name)} />}
          />
        </FormField>
        <FormField
          label='Headline'
          description='Provide a short and catchy phrase that describes your bot.'
          errorText={errors.headline?.message}
        >
          <Controller
            control={control}
            name='headline'
            render={({ field }) => (
              <TextArea
                {...field}
                placeholder='A powerful and multi-functional role bot.'
                status={errorStatus(errors.headline)}
              />
            )}
          />
        </FormField>
        <FormField
          label='Full Description'
          description='Tell us what your bot can do. We want to hear the whole story!'
          errorText={errors.description?.message}
        >
          <Controller
            control={control}
            name='description'
            render={({ field }) => (
              <RichTextEditor
                value={field.value || ''}
                onChange={field.onChange}
                customClass='custom-editor'
              />
            )}
          />
        </FormField>
        <FormField label='Auto-publish?' customClass='!items-center'>
          <Controller control={control} name='isAutoPublished' render={({ field }) => <Checkbox {...field} />} />
        </FormField>
        <FormField
          label='Install Link'
          description='A place where users can install your bot on their Mezon server.'
          errorText={errors.installLink?.message}
        >
          <Controller
            control={control}
            name='installLink'
            render={({ field }) => (
              <Input
                {...field}
                placeholder='https://mezon.ai/oauth2/authorize?client_id=1261258962204889149&scope=bot'
                status={errorStatus(errors.installLink)}
              />
            )}
          />
        </FormField>
        <FormField
          label='Prefix'
          description='What keyword or phrase does your bot react to?'
          errorText={errors.prefix?.message}
        >
          <Controller
            control={control}
            name='prefix'
            render={({ field }) => <Input {...field} placeholder='*' status={errorStatus(errors.prefix)} />}
          />
        </FormField>
        <FormField
          label='Tags'
          description='Select the top 12 categories that best represent your community.'
          errorText={errors.tagIds?.message}
        >
          <Controller
            control={control}
            name='tagIds'
            render={({ field }) => (
              <>
                <Select
                  {...field}
                  allowClear
                  optionFilterProp='label'
                  value={field.value || []}
                  mode='multiple'
                  options={options}
                  placeholder='Search for tags'
                  tagRender={() => <></>} // Hides tags inside the field
                  status={errors?.tagIds?.message ? 'error' : ''}
                  open={dropdownOpen}
                  onDropdownVisibleChange={(visible) => setDropdownOpen(visible)}
                  onChange={(value) => {
                    field.onChange(value)
                    setDropdownOpen(false) // Close the dropdown after selection
                  }}
                />
                {(field.value ?? []).length > 0 && (
                  <div className='mt-2 flex flex-wrap gap-2'>
                    {(field.value ?? []).map((tag) => {
                      const tagOption = options.find((opt) => opt.value === tag)
                      // Call customTagRender manually outside Select
                      return tagRender({
                        label: tagOption?.label,
                        closable: true,
                        onClose: () => {
                          const updatedTags = (field.value ?? []).filter((t) => t !== tag)
                          field.onChange(updatedTags)
                        }
                      })
                    })}
                  </div>
                )}
              </>
            )}
          />
        </FormField>
        <FormField
          label='Support URL'
          description='People might have many questions about your bot, make sure you can answer them!'
          errorText={errors.supportUrl?.message}
        >
          <Controller
            control={control}
            name='supportUrl'
            render={({ field }) => (
              <Input {...field} placeholder='https://mezon.ai/support' status={errorStatus(errors.supportUrl)} />
            )}
          />
        </FormField>
        <FormField
          label='Note'
          description='If you have any important information for the reviewer, you can share it here'
          errorText={errors.remark?.message}
        >
          <Controller
            control={control}
            name='remark'
            render={({ field }) => (
              <TextArea
                {...field}
                rows={4}
                placeholder='Please share any important information or details about your bot that our reviewers should know'
                status={errorStatus(errors.remark)}
              />
            )}
          />
        </FormField>
        <FormField label='Social Links' description='Link your social channels' >
          <div className='flex flex-col sm:flex-row sm:items-top gap-4 w-full'>
            <div className='flex-1'>
              <Select
                options={optionsLink}
                placeholder='Link Types'
                className='w-full'
                value={selectedSocialLink}
                onChange={(value) => {
                  setSelectedSocialLink(value)
                }}
              />
            </div>
            <div className='flex flex-2 items-top gap-4'>
              <Form.Item
                validateStatus={addLinkError ? 'error' : ''}
                help={addLinkError || ''}
                className='flex-1 mb-0'
              >
                <Input
                  value={socialLinkUrl}
                  prefix={
                    selectedSocialLink
                      ? linkTypeList.data.find(item => item.id === selectedSocialLink)?.prefixUrl || ''
                      : ''
                  }
                  onChange={handleSocialLinkUrlChange}
                  disabled={!selectedSocialLink}
                />
              </Form.Item>
              <div className='flex justify-end'>
                <Button onClick={addNewLink} customClassName='!w-[70px]'>
                  Add
                </Button>
              </div>
            </div>
          </div>
          {!!socialLinksData.length &&
            socialLinksData.map((link, index) => {
              return (
                <Controller
                  key={link.id}
                  name={`socialLinks.${index}.url`}
                  control={control}
                  render={({ field }) => (
                    <div className="flex gap-4 w-full">
                      <Form.Item
                        validateStatus={errors?.socialLinks?.[index]?.url ? 'error' : ''}
                        help={errors?.socialLinks?.[index]?.url?.message}
                        className="flex-1"
                      >
                        <Input
                          {...field}
                          placeholder="Enter link"
                          prefix={
                            <SocialLinkIcon
                              src={link?.type?.icon}
                              prefixUrl={link?.type?.prefixUrl}
                            />
                          }
                          onChange={(e) => field.onChange(e.target.value)}
                          onBlur={(event) =>
                            update(index, {
                              ...socialLinksData[index],
                              url: event.target.value,
                            })
                          }
                        />
                      </Form.Item>
                      <Button onClick={() => remove(index)} customClassName="!w-[70px] mt-[2px]">
                        Delete
                      </Button>
                    </div>
                  )}
                />
              )
            })}
        </FormField>
        <div className='flex !justify-end pt-8 gap-4 items-center'>
          <Button color='default' variant='outlined' customClassName='w-[200px]'>
            Preview
          </Button>
          <Button disabled={isUpdating || !!errors?.socialLinks} loading={isUpdating} htmlType='submit' customClassName='w-[200px]'>
            Save
          </Button>
        </div>
      </Form>
    </div>
  )
}

export default AddBotForm
