import { Controller, useFormContext, useWatch, useFieldArray } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Input, Checkbox, Select, Form, InputNumber } from 'antd'
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

const SocialLinkIcon = ({ src, prefixUrl }: { src?: string; prefixUrl?: string }) => (
  <div className='flex items-center gap-2'>
    <ImgIcon src={getUrlMedia(src!) || ''} width={17} /> {prefixUrl}
  </div>
)

const Step3FillDetails = ({ isEdit }: { isEdit: boolean }) => {
  const { t } = useTranslation(['new_bot_page', 'validation', 'common'])
  const { control, formState: { errors }, setError, clearErrors } = useFormContext<CreateMezonAppRequest>()
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
      siteName: link.prefixUrl || ''
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
      setAddLinkError(t('new_bot_page.step3.errors.link_exists'))
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
            message: t('new_bot_page.step3.errors.link_duplicate')
          })
        )
      } else {
        clearErrors(`socialLinks.${indexes[0]}.url`)
      }
    })
  }, [socialLinksData, setError, clearErrors])

  return (
    <>
      <FormField label={t('new_bot_page.step3.name')} required description={t('new_bot_page.step3.name_desc')} errorText={errors.name?.message}>
        <Controller
          control={control}
          name='name'
          render={({ field }) => (
            <Input {...field} className='placeholder:!text-primary' placeholder={t('new_bot_page.step3.placeholders.name')} status={errorStatus(errors.name)} />
          )}
        />
      </FormField>

      <FormField
        label={t('new_bot_page.step3.headline')}
        required
        description={t('new_bot_page.step3.headline_desc')} 
        errorText={errors.headline?.message}
      >
        <Controller
          control={control}
          name='headline'
          render={({ field }) => (
            <TextArea {...field} placeholder={t('new_bot_page.step3.placeholders.headline')}
              className='placeholder:!text-primary'
              status={errorStatus(errors.headline)} />
          )}
        />
      </FormField>

      <FormField
          label={t('new_bot_page.step3.description')}
          required
          description={t('new_bot_page.step3.description_desc')}
          errorText={errors.description?.message}>
        <Controller
          control={control}
          name='description'
          render={({ field }) => (
            <RichTextEditor value={field.value || ''} onChange={field.onChange} placeholder={t('new_bot_page.step3.description_desc')} />
          )}
        />
      </FormField>

      <FormField label={t('new_bot_page.step3.auto_publish')} customClass='!items-center'>
        <Controller
          control={control}
          name='isAutoPublished'
          render={() => (
            <Checkbox checked={true} disabled />
          )}
        />
      </FormField>

      <FormField label={t('new_bot_page.step3.install_link')} description={t('new_bot_page.step3.install_link_desc')}>
        <Input value={inviteURL} disabled className="!text-primary !border-transparent" />
      </FormField>
      {
        type === MezonAppType.BOT &&
          <FormField
              label={t('new_bot_page.step3.prefix')}
              required
              description={t('new_bot_page.step3.prefix_desc')}
              errorText={errors.prefix?.message}>
            <Controller
              control={control}
              name='prefix'
              render={({ field }) => (
                <Input {...field} className='placeholder:!text-primary' placeholder={t('new_bot_page.step3.placeholders.prefix')} status={errorStatus(errors.prefix)} />
              )}
            />
          </FormField>
      }
      <FormField
          label={t('new_bot_page.step3.tags')}
          required
          description={t('new_bot_page.step3.tags_desc')}
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
                placeholder={t('new_bot_page.step3.placeholders.tags')}
                status={errors?.tagIds?.message ? 'error' : ''}
                options={tagOptions}
                open={dropdownOpen}
                onOpenChange={setDropdownOpen}
                onChange={(value) => {
                  field.onChange(value)
                  setDropdownOpen(false)
                }}
                className='h-8 flex items-center justify-between'
              />
            </>
          )}
        />
      </FormField>
      {/* TAG PRICE */}
      <FormField label={t('new_bot_page.step3.tag_price')} description={t('new_bot_page.step3.tag_price_desc')} errorText={errors.pricingTag?.message}>
        <Controller
          control={control}
          name='pricingTag'
          render={({ field }) => (
            <Select
              {...field}
              allowClear
              placeholder={t('new_bot_page.step3.placeholders.tag_price')}
              status={errors?.pricingTag?.message ? 'error' : ''}
              options={Object.values(AppPricing).map(value => ({
                label: t(`enums.app_pricing.${value}`, { ns: 'common' }),
                value,
              }))}
              onChange={(value) => field.onChange(value)}
            />
          )}
        />
      </FormField>

      {/* PRICE */}
      <FormField label={t('new_bot_page.step3.price')} description={t('new_bot_page.step3.price_desc')} errorText={errors.price?.message}>
        <Controller
          control={control}
          name='price'
          render={({ field }) => <InputNumber {...field} placeholder={t('new_bot_page.step3.placeholders.price')} status={errorStatus(errors.price)} />}
        />
      </FormField>

      <FormField label={t('new_bot_page.step3.support_url')} required description={t('new_bot_page.step3.support_url_desc')} errorText={errors.supportUrl?.message}>
        <Controller
          control={control}
          name='supportUrl'
          render={({ field }) => (
            <Input {...field} className='placeholder:!text-primary' placeholder={t('new_bot_page.step3.placeholders.support_url')} status={errorStatus(errors.supportUrl)} />
          )}
        />
      </FormField>

      {isEdit && (
        <FormField 
          label={t('new_bot_page.step3.changelog')}
          required
          description={t('new_bot_page.step3.changelog_desc')} 
          errorText={errors.changelog?.message}
        >
          <Controller
            control={control}
            name='changelog'
            render={({ field }) => (
              <TextArea 
                {...field} 
                rows={4}
                className='placeholder:!text-primary'
                placeholder={t('new_bot_page.step3.placeholders.changelog')}
                status={errorStatus(errors.changelog)}
              />
            )}
          />
        </FormField>
      )}

      <FormField label={t('new_bot_page.step3.social_links')} description={t('new_bot_page.step3.social_links_desc')}>
        <div className='flex flex-col sm:flex-row gap-4'>
          <Select
            options={linkOptions}
            value={selectedSocialLink}
            onChange={setSelectedSocialLink}
            placeholder={t('new_bot_page.step3.placeholders.link_type')}
            className='w-full sm:w-1/3 h-8'
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
          <Button variant='outlined' onClick={addNewLink}>{t('new_bot_page.buttons.add')}</Button>
        </div>

        {socialLinksData.map((link, index) => {
          const errorMessage = errors.socialLinks?.[index]?.url?.message;
          return (
            <Controller
              key={link.id}
              name={`socialLinks.${index}.url`}
              control={control}
              render={({ field }) => (
                <div className='flex gap-2 mt-2'>
                  <Form.Item
                    validateStatus={errorMessage ? 'error' : ''}
                    help={errorMessage ? t(errorMessage, { ns: 'validation' }) : ''}
                    className='flex-1'
                  >
                    <Input
                      {...field}
                      prefix={<SocialLinkIcon src={link.type?.icon} prefixUrl={link.type?.prefixUrl} />}
                      onBlur={(e) => update(index, { ...link, url: e.target.value })}
                    />
                  </Form.Item>
                <Button color='danger' onClick={() => remove(index)}>{t('new_bot_page.buttons.delete')}</Button>
                </div>
              )}
            />
          );
        })}
      </FormField>
    </>
  )
}

export default Step3FillDetails
