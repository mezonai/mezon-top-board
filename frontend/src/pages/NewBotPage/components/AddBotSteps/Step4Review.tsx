import { getMezonInstallLink } from '@app/utils/mezonApp'
import { useFormContext } from 'react-hook-form'

const Step4Review = () => {
  const { getValues } = useFormContext()
  const values = getValues()

  return (
    <div>
      <h3 className='text-xl font-semibold mb-4'>Review Your Information</h3>
      <ul className='space-y-2'>
        <li><strong>Type:</strong> {values.type}</li>
        <li><strong>Bot/App ID:</strong> {values.mezonAppId}</li>
        <li><strong>Name:</strong> {values.name}</li>
        <li><strong>Headline:</strong> {values.headline}</li>
        <li><strong>Prefix:</strong> {values.prefix}</li>
        <li><strong>Auto Publish:</strong> {values.isAutoPublished ? 'Yes' : 'No'}</li>
        <li><strong>Invite URL:</strong> {getMezonInstallLink(values.type, values.mezonAppId)}</li>
        <li><strong>Description:</strong></li>
        <div className='border p-2 rounded' dangerouslySetInnerHTML={{ __html: values.description || '' }} />
      </ul>
    </div>
  )
}

export default Step4Review
