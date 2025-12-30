import { Modal, Descriptions, Tag, Alert } from 'antd'
import { useTranslation } from "react-i18next";
import { WizardStatus } from '@app/enums/botWizard.enum'
import { getStatusColor } from '../helpers'
import { formatDate } from '@app/utils/date'
import { BotWizard } from '@app/types/botWizard.types'

type Props = {
    open: boolean
    onClose: () => void
    item: BotWizard
}

export default function BotWizardDetailModal({ open, onClose, item }: Props) {
    const { t } = useTranslation();
    return (
        <Modal
            open={open}
            onCancel={onClose}
            onOk={onClose}
            title={t('bot_wizard_detail.title')}
            footer={null}
            centered
        >
            <div className='flex flex-col gap-4'>
                {item.status === WizardStatus.EXPIRED && (
                    <Alert
                        message={t('bot_wizard_detail.expired_title')}
                        description={t('bot_wizard_detail.expired_desc')}
                        type="error"
                        showIcon
                    />
                )}

                <Descriptions bordered column={1} size='small'>
                    <Descriptions.Item label={t('bot_wizard_detail.file_name')}>
                        {item.tempFile?.fileName ? (
                            <span className="font-medium">{item.tempFile.fileName}</span>
                        ) : (
                            t('bot_wizard_detail.processing')
                        )}
                    </Descriptions.Item>
                    <Descriptions.Item label={t('bot_wizard_detail.status')}>
                        <Tag color={getStatusColor(item.status)}>
                            {t(`bot_wizard_requests.status.${item.status.toLowerCase()}`)}
                        </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label={t('bot_wizard_detail.expires_at')}>
                        {formatDate(item.tempFile?.expiredAt) || t('bot_wizard_detail.processing')}
                    </Descriptions.Item>
                    <Descriptions.Item label={t('bot_wizard_detail.template')}>
                        {item.templateJson && (
                            <pre className='max-h-60 overflow-auto bg-container p-2 rounded-md border border-border text-xs whitespace-pre-wrap font-mono'>
                                {JSON.stringify(JSON.parse(item.templateJson), null, 2)}
                            </pre>
                        )}
                    </Descriptions.Item>
                </Descriptions>
            </div>
        </Modal>
    )
}
