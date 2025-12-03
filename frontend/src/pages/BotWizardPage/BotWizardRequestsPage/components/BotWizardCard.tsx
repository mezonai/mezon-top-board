import { Tag } from 'antd'
import MtbTypography from '@app/mtb-ui/Typography/Typography'
import MtbButton from '@app/mtb-ui/Button'
import { BotWizardResponse, WizardStatus } from '../../MockData'
import { useState } from 'react'
import BotWizardDetailModal from './BotWizardDetailModal'
import IntegrationTags from './IntegrationTags'
import { useBotGeneratorGetFileMutation } from '@app/services/api/botGenerator/botGenerator'

const statusColor: Record<WizardStatus, string> = {
    PROCESSING: 'blue',
    COMPLETED: 'green',
    EXPIRED: 'red',
}

export default function BotWizardCard({ item }: { item: BotWizardResponse }) {
    const [downloadFile] = useBotGeneratorGetFileMutation();
    
  const handleDownload = async () => {
    try {
      const blob = await downloadFile(item.id).unwrap();

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${item.fileName || "bot-wizard"}.zip`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error("Download error:", e);
    }
  };
    const [open, setOpen] = useState(false)
    const created = new Date(item.createdAt)
    const actions = (
        <>
            <MtbButton size='large' color='primary' variant='outlined' onClick={() => setOpen(true)}>View Details</MtbButton>
            {item.status === WizardStatus.Completed && (
                <MtbButton size='large' color='primary' variant='solid' className='ml-2' onClick={handleDownload}>Download .zip</MtbButton>
            )}
        </>
    )

    return (
        <>
            <div className='rounded-xl p-5 shadow-sm hover:shadow-lg transition-shadow bg-white border border-gray-100 flex flex-col gap-3'>
                <div className='flex items-start justify-between gap-3'>
                    <div className='min-w-0'>
                        <MtbTypography variant='h3' customClassName='truncate'>{item.name || ''}</MtbTypography>
                        <MtbTypography variant='p' customClassName='!pl-0 text-gray-500 truncate'>
                            {item.description || ''}
                        </MtbTypography>
                    </div>
                    <Tag color={statusColor[item.status]} className='text-sm capitalize'>{item.status || ''}</Tag>
                </div>

                <div className='grid grid-cols-2 gap-3 text-sm text-gray-600'>
                    {item.prefix && (
                        <div>
                            <span className='text-gray-400'>Prefix:</span> <span className='font-medium'>{item?.prefix || ''}</span>
                        </div>
                    )}
                    <div>
                        <span className='text-gray-400'>Commands:</span> <span className='font-medium'>{item.commands?.length || 0}</span>
                    </div>
                    <div>
                        <span className='text-gray-400'>Events:</span> <span className='font-medium'>{item.events?.length || 0}</span>
                    </div>
                    <div>
                        <span className='text-gray-400'>Integrations:</span>
                        <IntegrationTags integrations={item.integrations || []} className='ml-2' />
                    </div>
                    <div>
                        <span className='text-gray-400'>.env pairs:</span> <span className='font-medium'>{item.envPairs?.length || 0}</span>
                    </div>
                    <div>
                        <span className='text-gray-400'>Created:</span> <span className='font-medium'>{created.toLocaleString() || ''}</span>
                    </div>
                </div>

                <div className='pt-2'>
                    {actions}
                </div>
            </div>
            <BotWizardDetailModal open={open} onClose={() => setOpen(false)} item={item} />
        </>
    )
}
