import { Controller, useFormContext, useWatch, useFieldArray } from 'react-hook-form'
import { Input, Checkbox, Select, Form, TagProps } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import FormField from '@app/components/FormField/FormField'
import RichTextEditor from '@app/components/RichText/RichText'
import { errorStatus } from '@app/constants/common.constant'
import { RootState } from '@app/store'
import { ITagStore } from '@app/store/tag'
import { ILinkTypeStore } from '@app/store/linkType'
import Button from '@app/mtb-ui/Button'
import { ImgIcon } from '@app/mtb-ui/ImgIcon/ImgIcon'
import { AddBotFormValues } from '../../NewBotPage'

const SocialLinkIcon = ({ src, prefixUrl }: { src?: string; prefixUrl?: string }) => (
  <div className='flex items-center gap-2'>
    <ImgIcon src={src || ''} width={17} /> {prefixUrl}
  </div>
)

const Step3FillDetails = () => {
  const { control, setValue, formState: { errors }, setError, clearErrors } = useFormContext<AddBotFormValues>()
  const type = useWatch({ control, name: 'type' })
  const botId = useWatch({ control, name: 'botId' })

  const { tagList } = useSelector<RootState, ITagStore>((s) => s.tag)
  const { linkTypeList } = useSelector<RootState, ILinkTypeStore>((s) => s.link)

  const {
    fields: socialLinksData,
    append,
    remove,
    update
  } = useFieldArray({
    control,
    name: 'socialLinks'
  })

  const [selectedSocialLink, setSelectedSocialLink] = useState<string>('')
  const [socialLinkUrl, setSocialLinkUrl] = useState<string>('')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [addLinkError, setAddLinkError] = useState<string | null>(null)

  const baseURL = type === 'app'
    ? 'https://mezon.ai/developers/app/install/'
    : 'https://mezon.ai/developers/bot/install/'

  const inviteURL = botId ? `${baseURL}${botId}` : ''

  useEffect(() => {
    if (inviteURL) setValue('installLink', inviteURL)
  }, [inviteURL, setValue])

  const tagOptions = useMemo(() => {
    return tagList.data?.map(tag => ({ label: tag.name, value: tag.id })) || []
  }, [tagList])

  const linkOptions = useMemo(() => {
    return linkTypeList.data?.map(link => ({
      icon: link.icon,
      label: <SocialLinkIcon src={link.icon} prefixUrl={link.name} />,
      name: link.name,
      value: link.id,
      siteName: link.prefixUrl
    })) || []
  }, [linkTypeList])

  const tagRender = (props: TagProps & { label?: string }) => {
    const { label, closable, onClose } = props
    return (
      <div className='px-2 rounded-md inline-flex items-center mr-2 text-black capitalize !bg-gray-300'>
        <span>{label}</span>
        {closable && (
          <span onClick={onClose} className='ml-2 cursor-pointer font-bold'>×</span>
        )}
      </div>
    )
  }

  const addNewLink = () => {
    const trimmedUrl = socialLinkUrl.trim()
    if (!selectedSocialLink || !trimmedUrl) return

    const isDuplicate = socialLinksData.some(link =>
      link.url?.trim() === trimmedUrl &&
      link.linkTypeId === selectedSocialLink
    )

    if (isDuplicate) {
      setAddLinkError('This link already exists.')
      return
    }

    setAddLinkError(null)

    const selected = linkOptions.find(opt => opt.value === selectedSocialLink)
    if (!selected) return


    const newLink = {
      icon: selected.icon,
      url: trimmedUrl,
      linkTypeId: selected?.value,
      type: {
        id: selected?.value,
        name: selected?.name,
        prefixUrl: selected?.siteName,
        icon: selected?.icon
      }
    }
    append(newLink)

    setSocialLinkUrl('')
    setSelectedSocialLink('')
  }

  // Validate duplicates
  useEffect(() => {
    const seen = new Map<string, number[]>()
    socialLinksData.forEach((link, i) => {
      const key = `${link.linkTypeId}_${link.url?.trim()}`
      const arr = seen.get(key) || []
      arr.push(i)
      seen.set(key, arr)
    })

    seen.forEach((indexes) => {
      if (indexes.length > 1) {
        indexes.forEach(i =>
          setError(`socialLinks.${i}.url`, {
            type: 'duplicate',
            message: 'This link is duplicated.'
          })
        )
      } else {
        clearErrors(`socialLinks.${indexes[0]}.url`)
      }
    })
  }, [socialLinksData, setError, clearErrors])

  return (
    <>
      <FormField label='Name' errorText={errors.name?.message}>
        <Controller
          control={control}
          name='name'
          render={({ field }) => (
            <Input {...field} placeholder='Bot name' status={errorStatus(errors.name)} />
          )}
        />
      </FormField>

      <FormField label='Headline' errorText={errors.headline?.message}>
        <Controller
          control={control}
          name='headline'
          render={({ field }) => (
            <TextArea {...field} placeholder='Short catchy description' status={errorStatus(errors.headline)} />
          )}
        />
      </FormField>

      <FormField label='Description' errorText={errors.description?.message}>
        <Controller
          control={control}
          name='description'
          render={({ field }) => (
            <RichTextEditor value={field.value || ''} onChange={field.onChange} />
          )}
        />
      </FormField>

      <FormField label='Prefix' errorText={errors.prefix?.message}>
        <Controller
          control={control}
          name='prefix'
          render={({ field }) => (
            <Input {...field} placeholder='!' status={errorStatus(errors.prefix)} />
          )}
        />
      </FormField>

      <FormField label='Auto Publish'>
        <Controller
          control={control}
          name='isAutoPublished'
          render={({ field }) => (
            <Checkbox {...field}>Publish automatically after approval</Checkbox>
          )}
        />
      </FormField>

      <FormField label='Invite URL' errorText={errors.installLink?.message}>
        <Controller
          control={control}
          name='installLink'
          render={({ field }) => (
            <Input {...field} value={inviteURL} disabled status={errorStatus(errors.installLink)} />
          )}
        />
      </FormField>

      <FormField label='Tags' errorText={errors.tagIds?.message}>
        <Controller
          control={control}
          name='tagIds'
          render={({ field }) => (
            <>
              <Select
                {...field}
                allowClear
                mode='multiple'
                options={tagOptions}
                tagRender={() => <></>}
                open={dropdownOpen}
                onDropdownVisibleChange={setDropdownOpen}
                onChange={(value) => {
                  field.onChange(value)
                  setDropdownOpen(false)
                }}
              />
              <div className='mt-2 flex flex-wrap gap-2'>
                {(field.value ?? []).map((tag) => {
                  const opt = tagOptions.find(o => o.value === tag)
                  return tagRender({
                    label: opt?.label,
                    closable: true,
                    onClose: () => field.onChange(field.value.filter((t: string) => t !== tag))
                  })
                })}
              </div>
            </>
          )}
        />
      </FormField>

      <FormField label='Support URL' errorText={errors.supportUrl?.message}>
        <Controller
          control={control}
          name='supportUrl'
          render={({ field }) => (
            <Input {...field} placeholder='https://yourdomain.com/support' status={errorStatus(errors.supportUrl)} />
          )}
        />
      </FormField>

      <FormField label='Note'>
        <Controller
          control={control}
          name='remark'
          render={({ field }) => (
            <TextArea {...field} rows={3} placeholder='Any notes for reviewer?' />
          )}
        />
      </FormField>

      <FormField label='Social Links'>
        <div className='flex flex-col sm:flex-row gap-4'>
          <Select
            options={linkOptions}
            value={selectedSocialLink}
            onChange={setSelectedSocialLink}
            placeholder='Link Type'
            className='w-full sm:w-1/3'
          />
          <Form.Item
            validateStatus={addLinkError ? 'error' : ''}
            help={addLinkError}
            className='flex-1 mb-0'
          >
            <Input
              value={socialLinkUrl}
              onChange={(e) => setSocialLinkUrl(e.target.value)}
              prefix={
                selectedSocialLink
                  ? linkTypeList.data.find(l => l.id === selectedSocialLink)?.prefixUrl || ''
                  : ''
              }
              disabled={!selectedSocialLink}
            />
          </Form.Item>
          <Button onClick={addNewLink}>Add</Button>
        </div>

        {socialLinksData.map((link, index) => (
          <Controller
            key={link.id}
            name={`socialLinks.${index}.url`}
            control={control}
            render={({ field }) => (
              <div className='flex gap-2 mt-2'>
                <Form.Item
                  validateStatus={errors.socialLinks?.[index]?.url ? 'error' : ''}
                  help={errors.socialLinks?.[index]?.url?.message}
                  className='flex-1'
                >
                  <Input
                    {...field}
                    prefix={<SocialLinkIcon src={link.type?.icon} prefixUrl={link.type?.prefixUrl} />}
                    onBlur={(e) => update(index, { ...link, url: e.target.value })}
                  />
                </Form.Item>
                <Button onClick={() => remove(index)}>Delete</Button>
              </div>
            )}
          />
        ))}
      </FormField>
    </>
  )
}

export default Step3FillDetails
