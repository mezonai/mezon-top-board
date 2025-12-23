import { Modal, Descriptions, Tag, Alert } from 'antd'
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
    return (
        <Modal
            open={open}
            onCancel={onClose}
            onOk={onClose}
            title='File Metadata'
            footer={null}
            centered
        >
            <div className='flex flex-col gap-4'>
                {status === WizardStatus.EXPIRED && (
                    <Alert
                        message="File Expired"
                        description="This file has been removed from the server and is no longer available for download."
                        type="error"
                        showIcon
                    />
                )}

                <Descriptions bordered column={1} size='small'>
                    <Descriptions.Item label="File Name">
                        {item.tempFile?.fileName ? (
                            <span className="font-medium">{item.tempFile.fileName}</span>
                        ) : (
                            '[PROCESSING]'
                        )}
                    </Descriptions.Item>
                    <Descriptions.Item label="Status">
                        <Tag color={getStatusColor(item.status)}>
                            {item.status}
                        </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Expires At">
                        {formatDate(item.tempFile?.expiredAt) || ('[PROCESSING]')}
                    </Descriptions.Item>
                    <Descriptions.Item label="Template">
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
