import { message, Tag, Tooltip } from 'antd'
import { useTranslation } from "react-i18next";
import MtbTypography from '@app/mtb-ui/Typography/Typography'
import MtbButton from '@app/mtb-ui/Button'
import { useState } from 'react'
import BotWizardDetailModal from './BotWizardDetailModal'
import { WizardStatus } from '@app/enums/botWizard.enum'
import { useLazyTempFilesDownloadQuery } from '@app/services/api/tempFile/tempStorage'
import { 
    FileZipOutlined, 
    CalendarOutlined, 
    DownloadOutlined, 
    InfoCircleOutlined 
} from '@ant-design/icons'
import { formatDate } from '@app/utils/date'
import { getStatusColor } from '../helpers'
import { BotWizard } from '@app/types/botWizard.types'

export default function BotWizardCard({ item }: { item: BotWizard }) {
    const { t } = useTranslation(['bot_wizard_page']);
    const [open, setOpen] = useState(false)
    const [downloadTrigger, { isLoading: isDownloading }] = useLazyTempFilesDownloadQuery()

    const handleDownload = async () => {
        if (item.status === WizardStatus.EXPIRED) return;
        try {
            const blob = await downloadTrigger({ filePath: encodeURIComponent(item.tempFile?.filePath) }).unwrap()
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', item.tempFile?.fileName)
            document.body.appendChild(link)
            link.click()
            link.remove()
        } catch (err) {
            message.error(t('bot_wizard_card.download_failed'))
        }
    }

    return (
        <>
            <div className='rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow bg-container border border-border flex flex-col gap-3'>
                <div className='flex items-start justify-between gap-3'>
                    <div className='flex items-center gap-3 min-w-0'>
                        <div className='w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500'>
                            <FileZipOutlined style={{ fontSize: '20px' }} />
                        </div>
                        <div className='min-w-0 flex flex-col'>
                            <MtbTypography variant='h4' customClassName='truncate !mb-0' label={item.botName} />
                        </div>
                    </div>
                    <Tag color={getStatusColor(item.status)} className='m-0 capitalize'>
                        {t(`bot_wizard_requests.status.${item.status.toLowerCase()}`)}
                    </Tag>
                </div>

                <div className='flex items-center gap-2 text-sm bg-container p-2 rounded-md'>
                    <CalendarOutlined />
                    <span>{t('bot_wizard_card.created')}: <span className='font-medium'>{formatDate(item?.createdAt)}</span></span>
                </div>

                <div className='flex flex-wrap gap-2'>
                    <Tooltip title={t('bot_wizard_card.view_metadata')}>
                        <MtbButton 
                            variant='outlined' 
                            onClick={() => setOpen(true)}
                            icon={<InfoCircleOutlined />}
                        >
                            {t('bot_wizard_card.details')}
                        </MtbButton>
                    </Tooltip>

                    {item.status !== WizardStatus.EXPIRED && (
                        <MtbButton 
                            color='primary' 
                            variant='solid' 
                            onClick={handleDownload}
                            loading={isDownloading}
                            icon={<DownloadOutlined />}
                        >
                            {t('bot_wizard_card.download')}
                        </MtbButton>
                    )}
                </div>
            </div>
            <BotWizardDetailModal open={open} onClose={() => setOpen(false)} item={item} />
        </>
    )
}
