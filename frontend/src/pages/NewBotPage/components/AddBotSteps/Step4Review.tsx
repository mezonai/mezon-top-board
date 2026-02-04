import { getMezonInstallLink } from '@app/utils/mezonApp'
import { useFormContext, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Tag } from 'antd'
import { useSelector } from 'react-redux'
import { RootState } from '@app/store'
import { ITagStore } from '@app/store/tag'
import { transformMediaSrc } from '@app/utils/stringHelper'
import { CreateMezonAppRequest } from '@app/services/api/mezonApp/mezonApp.types'
import { TagResponse } from '@app/services/api/tag/tag.types'
import { SocialLink } from '@app/types'
import { MezonAppType } from '@app/enums/mezonAppType.enum'
import { getUrlMedia } from '@app/utils/stringHelper'
import { useState } from 'react'
import { AppLanguage } from '@app/enums/appLanguage.enum'
import MtbTypography from '@app/mtb-ui/Typography/Typography'
import SingleSelect, { IOption } from '@app/mtb-ui/SingleSelect'

const Step4Review = ({ isEdit }: { isEdit: boolean }) => {
  const { t } = useTranslation(['new_bot_page'])
  const { getValues } = useFormContext()
  const { tagList } = useSelector<RootState, ITagStore>((s) => s.tag)
  const { control } = useFormContext<CreateMezonAppRequest>()

  const type = useWatch({ control, name: 'type' })
  const values = getValues() as CreateMezonAppRequest
  const tagIds = values.tagIds ?? []
  const selectedTags = tagList.data?.filter((tag: TagResponse) => tagIds.includes(tag.id)) ?? []
  const [reviewLang, setReviewLang] = useState<AppLanguage>(AppLanguage.EN);
  const currentTrans = values.appTranslations?.find(t => t.language === reviewLang);

  const langOptions: IOption[] = [
    {
      value: AppLanguage.EN,
      label: (
        <span>
          English{' '}
          {values.defaultLanguage === AppLanguage.EN && (
            <span className="text-[10px] ml-1 opacity-80">({t('new_bot_page.step3.default')})</span>
          )}
        </span>
      )
    },
    {
      value: AppLanguage.VI,
      label: (
        <span>
          Tiếng Việt{' '}
          {values.defaultLanguage === AppLanguage.VI && (
            <span className="text-[10px] ml-1 opacity-80">({t('new_bot_page.step3.default')})</span>
          )}
        </span>
      )
    }
  ]

  const handleLangChange = (option: IOption) => {
    setReviewLang(option.value as AppLanguage)
  }

  return (
    <div className="text-primary">
      <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
        <MtbTypography variant='h3' customClassName="mb-0">
          {isEdit ? t('new_bot_page.step4.review_update') : t('new_bot_page.step4.review_info')}
        </MtbTypography>

        <SingleSelect
          getPopupContainer={(trigger) => trigger.parentElement}
          options={langOptions}
          value={langOptions.find((o) => o.value === reviewLang)}
          onChange={handleLangChange}
          placeholder="Language"
          size="middle"
          className="w-[11rem] text-primary"
        />
      </div>
      <ul className='space-y-2 text-primary'>
        <li>

          <ul className="space-y-3">
            <li>
              <strong>{t('new_bot_page.step4.name')} ({reviewLang === AppLanguage.EN ? 'English' : 'Tiếng Việt'}):</strong>
              <div className="mt-1">{currentTrans?.name || <span className="text-secondary italic">{t('new_bot_page.step4.none')}</span>}</div>
            </li>

            <li className='break-words'>
              <strong>{t('new_bot_page.step4.headline')} ({reviewLang === AppLanguage.EN ? 'English' : 'Tiếng Việt'}):</strong>
              <div className="mt-1">{currentTrans?.headline || <span className="text-secondary italic">{t('new_bot_page.step4.none')}</span>}</div>
            </li>

            <li>
              <strong>{t('new_bot_page.step4.description')} ({reviewLang === AppLanguage.EN ? 'English' : 'Tiếng Việt'}):</strong>
              {currentTrans?.description ? (
                <div className='mt-2 border border-border p-3 rounded-md text-sm description break-words bg-container'
                  dangerouslySetInnerHTML={{ __html: transformMediaSrc(currentTrans.description) }}
                />
              ) : (
                <div className="mt-1 text-secondary italic">{t('new_bot_page.step4.none')}</div>
              )}
            </li>
          </ul>
        </li>
        <div className="border-t border-border my-4"></div>
        <li><strong>{t('new_bot_page.step4.type')}</strong> {values.type}</li>
        <li><strong>{t('new_bot_page.step4.id')}</strong> {values.mezonAppId}</li>
        {type === MezonAppType.BOT && <li><strong>{t('new_bot_page.step4.prefix')}</strong> {values.prefix}</li>}
        <li><strong>{t('new_bot_page.step4.auto_publish')}</strong> {values.isAutoPublished ? t('new_bot_page.step4.yes') : t('new_bot_page.step4.no')}</li>
        <li className='break-words'><strong>{t('new_bot_page.step4.install_link')}</strong> <span className="text-secondary">{getMezonInstallLink(values.type, values.mezonAppId)}</span></li>
        <li>
          <strong>{t('new_bot_page.step4.tags')}</strong>
          <div className='gap-2 flex flex-wrap mt-1'>
            {selectedTags.length > 0 ? (
              selectedTags.map((tag: TagResponse) => (
                <Tag key={tag.id} className="bg-container-secondary text-primary border-border">
                  {tag.name}
                </Tag>
              ))
            ) : (
              <span className="text-secondary italic ml-2">{t('new_bot_page.step4.no_tags')}</span>
            )}
          </div>
        </li>
        <li>
          <strong>{t('new_bot_page.step4.tag_price')}</strong> {values.pricingTag}
        </li>
        <li>
          <strong>{t('new_bot_page.step4.price')}</strong> {values.price}
        </li>
        <li className='break-words'><strong>{t('new_bot_page.step4.support_url')} </strong>{values.supportUrl}</li>
        <li>
          <strong>{t('new_bot_page.step4.social_links')}</strong>
          <div className="mt-2 flex flex-col gap-2">
            {(values.socialLinks ?? []).length > 0 ? (
              values.socialLinks?.map((link: SocialLink, idx: number) => (
                <div key={idx} className="flex items-center gap-2 text-sm">
                  {link.type?.icon && (
                    <img src={getUrlMedia(link.type.icon)} alt={link.type?.name || ''} className="w-4 h-4" />
                  )}
                  <span className="font-medium">{link.type?.name || 'Link'}:</span>
                  <a href={(link.type?.prefixUrl ?? '') + (link.url ?? '')} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    {link.url ?? ''}
                  </a>
                </div>
              ))
            ) : (
              <span className="text-secondary italic ml-2">{t('new_bot_page.step4.no_links')}</span>
            )}
          </div>
        </li>
        <li>
          <strong>{t('new_bot_page.step4.changelog')} </strong>
          {values.changelog ? (
            <div className='mt-2 border border-border p-3 rounded-md text-sm bg-container whitespace-pre-wrap break-words'>
              {values.changelog}
            </div>
          ) : (
            <span className="text-secondary italic ml-2">{t('new_bot_page.step4.none')}</span>
          )}
        </li>
      </ul>
    </div>
  )
}

export default Step4Review