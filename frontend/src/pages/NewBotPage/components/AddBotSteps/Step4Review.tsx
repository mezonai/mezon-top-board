import { getMezonInstallLink } from '@app/utils/mezonApp'
import { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import useSubmitHandler from '../../hooks/useSubmitHandler'
import { Tag } from 'antd'
import { useSelector } from 'react-redux'
import { RootState } from '@app/store'
import { ITagStore } from '@app/store/tag'

const Step4Review = ({
  isEdit,
  bindSubmit,
  onSuccess,
  onError
}: {
  isEdit: boolean,
  bindSubmit: (submitFn: () => void) => void,
  onSuccess: (id: string) => void,
  onError: () => void
}) => {
  const submitHandler = useSubmitHandler(isEdit, { onSuccess, onError })
  const { getValues } = useFormContext()
  const { tagList } = useSelector<RootState, ITagStore>((s) => s.tag)

  useEffect(() => {
    bindSubmit(() => submitHandler())
  }, [bindSubmit, submitHandler])

  const values = getValues()

  const tagIds = values.tagIds ?? []
  const selectedTags = tagList.data?.filter(tag => tagIds.includes(tag.id)) ?? []

  return (
    <div>
      <h3 className='text-xl font-semibold mb-4'>{isEdit ? 'Review Your Update Information' : 'Review Your Information'}</h3>
      <ul className='space-y-2'>
        <li><strong>Type:</strong> {values.type}</li>
        <li><strong>Bot/App ID:</strong> {values.mezonAppId}</li>
        <li><strong>Name:</strong> {values.name}</li>
        <li className='break-words'><strong>Headline:</strong> {values.headline}</li>
        <li><strong>Prefix:</strong> {values.prefix}</li>
        <li><strong>Auto Publish:</strong> {values.isAutoPublished ? 'Yes' : 'No'}</li>
        <li className='break-words'><strong>Install Link:</strong> {getMezonInstallLink(values.type, values.mezonAppId)}</li>
        <li>
          <strong>Tags:</strong>
          <div className='gap-2'>
            {selectedTags.length > 0 ? (
              selectedTags.map((tag) => (
                <Tag key={tag.id}>{tag.name}</Tag>
              ))
            ) : (
              <span className="text-gray-500 italic ml-2">No tags selected</span>
            )}
          </div>
        </li>
        <li className='break-words'><strong>Support URL: </strong>{values.supportUrl}</li>
        <li>
          <strong>Social Links:</strong>
          <div className="mt-2 flex flex-col gap-2">
            {(values.socialLinks ?? []).length > 0 ? (
              values.socialLinks.map((link, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm">
                  {link.type?.icon && (
                    <img src={link.type.icon} alt={link.type.name} className="w-4 h-4" />
                  )}
                  <span className="font-medium">{link.type?.name || 'Link'}:</span>
                  <a href={link.type?.prefixUrl + link.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {link.url}
                  </a>
                </div>
              ))
            ) : (
              <span className="text-gray-500 italic ml-2">No social links added</span>
            )}
          </div>
        </li>
        <li><strong>Description:</strong></li>
        <div className='border border-gray-300 p-3 rounded-md text-sm description break-words' dangerouslySetInnerHTML={{ __html: values.description || '' }} />
      </ul>
    </div>
  )
}

export default Step4Review
