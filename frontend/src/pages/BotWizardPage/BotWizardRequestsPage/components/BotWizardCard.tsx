import { message, Tag, Tooltip } from 'antd'
import MtbTypography from '@app/mtb-ui/Typography/Typography'
import MtbButton from '@app/mtb-ui/Button'
import { useState } from 'react'
import BotWizardDetailModal from './BotWizardDetailModal'
import { WizardStatus } from '@app/enums/botWizard.enum'
import { TempFile } from '@app/types/tempFile.types'
import { useLazyTempFilesDownloadQuery } from '@app/services/api/tempFile/tempStorage'
import { 
    FileZipOutlined, 
    CalendarOutlined, 
    DownloadOutlined, 
    InfoCircleOutlined 
} from '@ant-design/icons'
import { formatDate } from '@app/utils/date'
import { getFileStatus, getStatusColor } from '../helpers'

interface BotWizardCardProps {
    item: TempFile;
}

export default function BotWizardCard({ item }: BotWizardCardProps) {
    const [open, setOpen] = useState(false)
    const [downloadTrigger, { isLoading: isDownloading }] = useLazyTempFilesDownloadQuery()
    
    const status = getFileStatus(item);
    const isExpired = status === WizardStatus.Expired;

    const handleDownload = async () => {
        if (isExpired) return;
        try {
            const blob = await downloadTrigger({ filePath: encodeURIComponent(item.filePath) }).unwrap()
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', item.fileName)
            document.body.appendChild(link)
            link.click()
            link.remove()
        } catch (err) {
            message.error('Failed to download file. Please try again later.')
        }
    }

    return (
        <>
            <div className='p-5 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col gap-4'>
                <div className='flex items-start justify-between gap-3'>
                    <div className='flex items-center gap-3 min-w-0'>
                        <div className='w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500'>
                            <FileZipOutlined style={{ fontSize: '20px' }} />
                        </div>
                        <div className='min-w-0 flex flex-col'>
                            <MtbTypography variant='h4' customClassName='truncate !mb-0' label={item.fileName} />
                            <span className="text-xs text-gray-400">{item.mimeType}</span>
                        </div>
                    </div>
                    <Tag color={getStatusColor(status)} className='m-0 capitalize'>
                        {status.toLowerCase()}
                    </Tag>
                </div>

                <div className='flex items-center gap-2 text-sm text-gray-500 bg-gray-50 p-2 rounded-md'>
                    <CalendarOutlined />
                    <span>Created: <span className='font-medium text-gray-700'>{formatDate(item.createdAt)}</span></span>
                </div>

                <div className='flex flex-wrap gap-2'>
                    <Tooltip title="View file metadata">
                        <MtbButton 
                            variant='outlined' 
                            onClick={() => setOpen(true)}
                            icon={<InfoCircleOutlined />}
                        >
                            Details
                        </MtbButton>
                    </Tooltip>

                    {!isExpired && (
                        <MtbButton 
                            color='primary' 
                            variant='solid' 
                            onClick={handleDownload}
                            loading={isDownloading}
                            icon={<DownloadOutlined />}
                        >
                            Download
                        </MtbButton>
                    )}
                </div>
            </div>
            <BotWizardDetailModal open={open} onClose={() => setOpen(false)} item={item} status={status} />
        </>
    )
}