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
import LanguageSelector from '@app/components/LanguageSelector/LanguageSelector'

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

  return (
    <div className="text-primary">
      <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
        <MtbTypography variant='h3' customClassName="mb-0">
          {isEdit ? t('new_bot_page.step4.review_update') : t('new_bot_page.step4.review_info')}
        </MtbTypography>

        <LanguageSelector 
            value={reviewLang} 
            onChange={setReviewLang} 
            defaultLanguage={values.defaultLanguage}
        />
      </div>
      <ul className='space-y-3 text-primary'>
        <li className='space-y-3'>
          <MtbTypography variant='h5' customClassName="mb-1 gap-1">
            {t('new_bot_page.step4.name')}
            <span className='font-normal'>
              {currentTrans?.name || <span className="text-secondary italic">{t('new_bot_page.step4.none')}</span>}
            </span>
          </MtbTypography>

          <MtbTypography variant='h5' customClassName="mb-1 gap-1 break-words">
            {t('new_bot_page.step4.headline')}
            <span className='font-normal'>
              {currentTrans?.headline || <span className="text-secondary italic">{t('new_bot_page.step4.none')}</span>}
            </span>
          </MtbTypography>

          <div>
            <MtbTypography variant='h5' customClassName="mb-1 gap-1">
              {t('new_bot_page.step4.description')}
            </MtbTypography>
            {currentTrans?.description ? (
              <div
                className='mt-2 border border-border p-3 rounded-md text-sm description break-words bg-container'
                dangerouslySetInnerHTML={{ __html: transformMediaSrc(currentTrans.description) }}
              />
            ) : (
              <div className="mt-1 text-secondary italic">{t('new_bot_page.step4.none')}</div>
            )}
          </div>
        </li>

        <li className="border-t border-border my-4" />
        
        <li>
          <MtbTypography variant='h5' customClassName="mb-1 gap-1">
            {t('new_bot_page.step4.type')}
            <span className='font-normal'>{values.type || <span className="text-secondary italic">{t('new_bot_page.step4.none')}</span>}</span>
          </MtbTypography>
        </li>

        <li>
          <MtbTypography variant='h5' customClassName="mb-1 gap-1">
            {t('new_bot_page.step4.id')}
            <span className='font-normal'>{values.mezonAppId || <span className="text-secondary italic">{t('new_bot_page.step4.none')}</span>}</span>
          </MtbTypography>
        </li>

        {type === MezonAppType.BOT && (
          <li>
            <MtbTypography variant='h5' customClassName="mb-1 gap-1">
              {t('new_bot_page.step4.prefix')}
              <span className='font-normal'>
                {values.prefix || <span className="text-secondary italic">{t('new_bot_page.step4.none')}</span>}
              </span>
            </MtbTypography>
          </li>
        )}

        <li>
          <MtbTypography variant='h5' customClassName="mb-1 gap-1">
            {t('new_bot_page.step4.auto_publish')}
            <span className='font-normal'>
              {values.isAutoPublished ? t('new_bot_page.step4.yes') : t('new_bot_page.step4.no')}
            </span>
          </MtbTypography>
        </li>

        <li className='break-words'>
          <MtbTypography variant='h5' customClassName="mb-1 gap-1">
            {t('new_bot_page.step4.install_link')}
            <span className="font-normal text-secondary">
              {getMezonInstallLink(values.type, values.mezonAppId)}
            </span>
          </MtbTypography>
        </li>

        <li>
          <MtbTypography variant='h5' customClassName="mb-1 gap-1">
            {t('new_bot_page.step4.tags')}
          </MtbTypography>
          <div className='gap-2 flex flex-wrap mt-1'>
            {selectedTags.length > 0 ? (
              selectedTags.map((tag: TagResponse) => (
                <Tag key={tag.id} className="bg-container-secondary text-primary border-border">
                  {tag.name}
                </Tag>
              ))
            ) : (
              <span className="text-secondary italic">{t('new_bot_page.step4.no_tags')}</span>
            )}
          </div>
        </li>

        <li>
          <MtbTypography variant='h5' customClassName="mb-1 gap-1">
            {t('new_bot_page.step4.tag_price')}
            <span className='font-normal'>
              {values.pricingTag || <span className="text-secondary italic">{t('new_bot_page.step4.none')}</span>}
            </span>
          </MtbTypography>
        </li>

        <li>
          <MtbTypography variant='h5' customClassName="mb-1 gap-1">
            {t('new_bot_page.step4.price')}
            <span className='font-normal'>
              {values.price ?? <span className="text-secondary italic">{t('new_bot_page.step4.none')}</span>}
            </span>
          </MtbTypography>
        </li>

        <li className='break-words'>
          <MtbTypography variant='h5' customClassName="mb-1 gap-1">
            {t('new_bot_page.step4.support_url')}
            <span className='font-normal'>
              {values.supportUrl || <span className="text-secondary italic">{t('new_bot_page.step4.none')}</span>}
            </span>
          </MtbTypography>
        </li>

        <li>
          <MtbTypography variant='h5' customClassName="mb-1 gap-1">
            {t('new_bot_page.step4.social_links')}
          </MtbTypography>
          <div className="mt-2 flex flex-col gap-2">
            {(values.socialLinks ?? []).length > 0 ? (
              values.socialLinks?.map((link: SocialLink, idx: number) => (
                <div key={idx} className="flex items-center gap-2 text-sm">
                  {link.type?.icon && (
                    <img src={getUrlMedia(link.type.icon)} alt={link.type?.name || ''} className="w-4 h-4" />
                  )}
                  <span className="font-medium">{link.type?.name || 'Link'}:</span>
                  <a
                    href={(link.type?.prefixUrl ?? '') + (link.url ?? '')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline break-words"
                  >
                    {link.url ?? ''}
                  </a>
                </div>
              ))
            ) : (
              <span className="text-secondary italic">{t('new_bot_page.step4.no_links')}</span>
            )}
          </div>
        </li>

        <li>
          <MtbTypography variant='h5' customClassName="mb-1 gap-1">
            {t('new_bot_page.step4.changelog')}
          </MtbTypography>
          {values.changelog ? (
            <div className='mt-2 border border-border p-3 rounded-md text-sm bg-container whitespace-pre-wrap break-words'>
              {values.changelog}
            </div>
          ) : (
            <div className="mt-1 text-secondary italic">{t('new_bot_page.step4.none')}</div>
          )}
        </li>
      </ul>
    </div>
  )
}

export default Step4Review