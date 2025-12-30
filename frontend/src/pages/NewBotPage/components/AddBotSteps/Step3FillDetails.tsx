import { Controller, useFormContext, useWatch, useFieldArray } from 'react-hook-form'
import { Input, Checkbox, Select, Form, Tag, InputNumber } from 'antd'
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
import { CreateMezonAppRequest } from '@app/services/api/mezonApp/mezonApp.types'
import { SocialLink } from '@app/types'
import { LinkTypeResponse } from '@app/services/api/linkType/linkType.types'
import { TagResponse } from '@app/services/api/tag/tag.types'
import { getMezonInstallLink } from '@app/utils/mezonApp'
import { MezonAppType } from '@app/enums/mezonAppType.enum'
import { AppPricing } from '@app/enums/appPricing'
import { getUrlMedia } from '@app/utils/stringHelper'
import styles from './Step3FillDetails.module.scss'

const SocialLinkIcon = ({ src, prefixUrl }: { src?: string; prefixUrl?: string }) => (
  <div className='flex items-center gap-2'>
    <ImgIcon src={getUrlMedia(src!) || ''} width={17} /> {prefixUrl}
  </div>
)

const Step3FillDetails = ({ isEdit }: { isEdit: boolean }) => {
  const { control, setValue, formState: { errors }, setError, clearErrors } = useFormContext<CreateMezonAppRequest>()
  const type = useWatch({ control, name: 'type' })
  const mezonAppId = useWatch({ control, name: 'mezonAppId' })

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

  const inviteURL = getMezonInstallLink(type, mezonAppId)

  const tagOptions = useMemo((): { label: string; value: string }[] => {
    return tagList.data?.map((tag: TagResponse) => ({ label: tag.name, value: tag.id })) || []
  }, [tagList])

  const linkOptions = useMemo((): { icon: string; label: React.ReactNode; name: string; value: string; siteName: string }[] => {
    return linkTypeList.data?.map((link: LinkTypeResponse) => ({
      icon: link.icon,
      label: <SocialLinkIcon src={link.icon} prefixUrl={link.name} />,
      name: link.name,
      value: link.id,
      siteName: link.prefixUrl
    })) || []
  }, [linkTypeList])

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

    const newLink: SocialLink = {
      url: trimmedUrl,
      linkTypeId: selected.value,
      type: {
        id: selected.value,
        name: selected.name,
        prefixUrl: selected.siteName,
        icon: selected.icon
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
      <FormField label='Name' required description='Name your bot' errorText={errors.name?.message}>
        <Controller
          control={control}
          name='name'
          render={({ field }) => (
            <Input {...field} className='placeholder:!text-primary' placeholder='MezonBot' status={errorStatus(errors.name)} />
          )}
        />
      </FormField>

      <FormField
        label='Headline'
        required
        description='Provide a short and catchy phrase that describes your bot.' 
        errorText={errors.headline?.message}
      >
        <Controller
          control={control}
          name='headline'
          render={({ field }) => (
            <TextArea {...field} placeholder='A powerful and multi-functional role bot'
              className='placeholder:!text-primary'
              status={errorStatus(errors.headline)} />
          )}
        />
      </FormField>

      <FormField
          label='Full Description'
          required
          description='Tell us what your bot can do. We want to hear the whole story!'
          errorText={errors.description?.message}>
        <Controller
          control={control}
          name='description'
          render={({ field }) => (
            <RichTextEditor value={field.value || ''} onChange={field.onChange} />
          )}
        />
      </FormField>

      <FormField label='Auto-Publish?' customClass='!items-center'>
        <Controller
          control={control}
          name='isAutoPublished'
          render={() => (
            <Checkbox checked={true} disabled />
          )}
        />
      </FormField>

      <FormField label='Install Link' description='A place where users can install your bot on their Mezon server.'>
        <Input value={inviteURL} disabled className="!text-primary !border-transparent" />
      </FormField>
      {
        type === MezonAppType.BOT &&
          <FormField
              label='Prefix'
              required
              description='What keyword or phrase does your bot react to?'
              errorText={errors.prefix?.message}>
            <Controller
              control={control}
              name='prefix'
              render={({ field }) => (
                <Input {...field} className='placeholder:!text-primary' placeholder='!' status={errorStatus(errors.prefix)} />
              )}
            />
          </FormField>
      }
      <FormField
          label='Tags'
          required
          description='Select the top 12 categories that best represent your community.'
          errorText={errors.tagIds?.message}>
        <Controller
          control={control}
          name='tagIds'
          render={({ field }) => (
            <>
              <Select
                {...field}
                allowClear
                mode='multiple'
                placeholder='Search for tags'
                status={errors?.tagIds?.message ? 'error' : ''}
                options={tagOptions}
                tagRender={() => <></>}
                open={dropdownOpen}
                onDropdownVisibleChange={setDropdownOpen}
                onChange={(value) => {
                  field.onChange(value)
                  setDropdownOpen(false)
                }}
                className={styles.themedSelect}
                popupClassName={styles.selectDropdown}
              />

              <div className='mt-2 flex flex-wrap gap-2'>
                {(field.value ?? []).map((tagId: string) => {
                  const tag = tagOptions.find(t => t.value === tagId)
                  return (
                    <Tag
                      key={tagId}
                      closable
                      onClose={() =>
                        field.onChange(field.value.filter((id: string) => id !== tagId))
                      }
                      className={styles.customTag}
                    >
                      {tag?.label}
                    </Tag>
                  )
                })}
              </div>
            </>
          )}
        />
      </FormField>
      {/* TAG PRICE */}
      <FormField label='Tag Price' description='Select FREE or PAID tag' errorText={errors.pricingTag?.message}>
        <Controller
          control={control}
          name='pricingTag'
          render={({ field }) => (
            <Select
              {...field}
              allowClear
              placeholder='Select tag price'
              status={errors?.pricingTag?.message ? 'error' : ''}
              options={Object.values(AppPricing).map(value => ({
                label: value,
                value,
              }))}
              onChange={(value) => field.onChange(value)}
              className={styles.themedSelect}
              popupClassName={styles.selectDropdown}
            />
          )}
        />
      </FormField>

      {/* PRICE */}
      <FormField label='Price' description='Set a price for your bot' errorText={errors.price?.message}>
        <Controller
          control={control}
          name='price'
          render={({ field }) => <InputNumber {...field} placeholder='MezonBot' status={errorStatus(errors.price)} />}
        />
      </FormField>

      <FormField label='Support URL' required description='People might have many questions about your bot, make sure you can answer them!' errorText={errors.supportUrl?.message}>
        <Controller
          control={control}
          name='supportUrl'
          render={({ field }) => (
            <Input {...field} className='placeholder:!text-primary' placeholder='https://yourdomain.com/support' status={errorStatus(errors.supportUrl)} />
          )}
        />
      </FormField>

      <FormField label='Note' description='If you have any important information for the reviewer, you can share it here'>
        <Controller
          control={control}
          name='remark'
          render={({ field }) => (
            <TextArea {...field} rows={3}
              className='placeholder:!text-primary'
              placeholder="Please share any important information or details about your bot that our reviewers should know"
              status={errorStatus(errors.remark)}
            />
          )}
        />
      </FormField>

      <FormField label='Social Links' description='Link your social channels'>
        <div className='flex flex-col sm:flex-row gap-4'>
          <Select
            options={linkOptions}
            value={selectedSocialLink}
            onChange={setSelectedSocialLink}
            placeholder='Link Type'
            className={`w-full sm:w-1/3 ${styles.themedSelect}`}
            popupClassName={styles.selectDropdown}
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
                  ? linkTypeList.data.find((l: LinkTypeResponse) => l.id === selectedSocialLink)?.prefixUrl || ''
                  : ''
              }
              disabled={!selectedSocialLink}
            />
          </Form.Item>
          <Button variant='outlined' onClick={addNewLink}>Add</Button>
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
                <Button color='danger' onClick={() => remove(index)}>Delete</Button>
              </div>
            )}
          />
        ))}
      </FormField>
    </>
  )
}

export default Step3FillDetails
