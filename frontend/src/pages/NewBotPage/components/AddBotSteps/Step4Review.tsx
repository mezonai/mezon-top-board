import { getMezonInstallLink } from '@app/utils/mezonApp'
import { useFormContext, useWatch } from 'react-hook-form'
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

const Step4Review = ({ isEdit }: { isEdit: boolean }) => {
  const { getValues } = useFormContext()
  const { tagList } = useSelector<RootState, ITagStore>((s) => s.tag)
  const { control} = useFormContext<CreateMezonAppRequest>()
  
  const type = useWatch({ control, name: 'type' })
  const values = getValues()
  const tagIds = values.tagIds ?? []
  const selectedTags = tagList.data?.filter((tag: TagResponse) => tagIds.includes(tag.id)) ?? []

  return (
    <div className="text-primary">
      <h3 className='text-xl font-semibold mb-4'>{isEdit ? 'Review Your Update Information' : 'Review Your Information'}</h3>
      <ul className='space-y-2 text-primary'>
        <li><strong>Type:</strong> {values.type}</li>
        <li><strong>Bot/App ID:</strong> {values.mezonAppId}</li>
        <li><strong>Name:</strong> {values.name}</li>
        <li className='break-words'><strong>Headline:</strong> {values.headline}</li>
        {type === MezonAppType.BOT && <li><strong>Prefix:</strong> {values.prefix}</li>}
        <li><strong>Auto Publish:</strong> {values.isAutoPublished ? 'Yes' : 'No'}</li>
        <li className='break-words'><strong>Install Link:</strong> <span className="text-secondary">{getMezonInstallLink(values.type, values.mezonAppId)}</span></li>
        <li>
          <strong>Tags:</strong>
          <div className='gap-2 flex flex-wrap mt-1'>
            {selectedTags.length > 0 ? (
              selectedTags.map((tag: TagResponse) => (
                <Tag key={tag.id} className="bg-container-secondary text-primary border-border">
                  {tag.name}
                </Tag>
              ))
            ) : (
              <span className="text-secondary italic ml-2">No tags selected</span>
            )}
          </div>
        </li>
        <li>
          <strong>Tag Price:</strong> {values.pricingTag}
        </li>
        <li>
          <strong>Price: </strong> {values.price}
        </li>
        <li className='break-words'><strong>Support URL: </strong>{values.supportUrl}</li>
        <li>
          <strong>Social Links:</strong>
          <div className="mt-2 flex flex-col gap-2">
            {(values.socialLinks ?? []).length > 0 ? (
              values.socialLinks.map((link: SocialLink, idx: number) => (
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
              <span className="text-secondary italic ml-2">No social links added</span>
            )}
          </div>
        </li>
        <li><strong>Note: </strong>{values.remark ==='' ? 'None' : values.remark}</li>
        {isEdit && (
          <li className='break-words'><strong>Changelog: </strong>{values.changelog ? values.changelog : 'None'}</li>
        )}
        <li><strong>Description:</strong></li>
        <div className='border border-border p-3 rounded-md text-sm description break-words bg-container' 
          dangerouslySetInnerHTML={{ __html: transformMediaSrc(values.description || '') }} />
      </ul>
    </div>
  )
}
 
export default Step4Review