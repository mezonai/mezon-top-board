import { getMezonInstallLink } from '@app/utils/mezonApp'
import { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import useSubmitHandler from '../../hooks/useSubmitHandler'

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

  useEffect(() => {
    bindSubmit(() => submitHandler())
  }, [bindSubmit, submitHandler])

  const values = getValues()

  return (
    <div>
      <h3 className='text-xl font-semibold mb-4'>{isEdit ? 'Review Your Update Information' : 'Review Your Information'}</h3>
      <ul className='space-y-2'>
        <li><strong>Type:</strong> {values.type}</li>
        <li><strong>Bot/App ID:</strong> {values.mezonAppId}</li>
        <li><strong>Name:</strong> {values.name}</li>
        <li><strong>Headline:</strong> {values.headline}</li>
        <li><strong>Prefix:</strong> {values.prefix}</li>
        <li><strong>Auto Publish:</strong> {values.isAutoPublished ? 'Yes' : 'No'}</li>
        <li><strong>Invite URL:</strong> {getMezonInstallLink(values.type, values.mezonAppId)}</li>
        <li><strong>Description:</strong></li>
        <div className='border border-gray-300 p-3 rounded-md text-sm max-h-64 overflow-auto truncate description' dangerouslySetInnerHTML={{ __html: values.description || '' }} />
      </ul>
    </div>
  )
}

export default Step4Review
