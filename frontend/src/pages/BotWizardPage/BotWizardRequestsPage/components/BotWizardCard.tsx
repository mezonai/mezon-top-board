import { Tag } from 'antd'
import MtbTypography from '@app/mtb-ui/Typography/Typography'
import MtbButton from '@app/mtb-ui/Button'
import { BotWizardResponse, WizardStatus } from '../../MockData'
import { useState } from 'react'
import BotWizardDetailModal from './BotWizardDetailModal'
import IntegrationTags from './IntegrationTags'
import { TempFileResponse } from '@app/services/api/tempStorage/tempStorage.types'
import moment from 'moment'

const statusColor: Record<WizardStatus, string> = {
  PROCESSING: 'blue',
  COMPLETED: 'green',
  EXPIRED: 'red',
}


export default function BotWizardCard({ item }: { item: TempFileResponse }) {

  const handleDownload = () => {
    const url = `http://localhost:8123/api/temp-files/${item.filePath}`;
    const link = document.createElement('a');
    link.href = url;
    link.download = item.fileName;
    link.click();
  };


  const [open, setOpen] = useState(false)
  const created = new Date(item.createdAt)
  const actions = (
    <>
      <MtbButton size='large' color='primary' variant='outlined' onClick={() => setOpen(true)}>View Details</MtbButton>
      <MtbButton size='large' color='primary' variant='solid' onClick={handleDownload} className='ml-2'>Download .zip</MtbButton>
    </>
  )

  return (
    <>
      <div className='rounded-xl p-5 shadow-sm hover:shadow-lg transition-shadow bg-white border border-gray-100 flex flex-col gap-3'>
        <div className='flex items-start justify-between gap-3'>
          <div className='min-w-0'>
            <MtbTypography variant='h3' customClassName='truncate'>{item.fileName}</MtbTypography>

          </div>
          <Tag className='text-sm capitalize'>{item.expiredAt < new Date() ? 'Expired' : 'Active'}</Tag>
        </div>

        <div className='grid grid-cols-2 gap-3 text-sm text-gray-600'>

          <div>
            <span className='text-gray-400'>Created:</span> <span className='font-medium'>{moment(created).format('DD/MM/YYYY : HH:mm:ss')}</span>
          </div>
        </div>

        <div className='pt-2'>
          {actions}
        </div>
      </div>

    </>
  )
}
