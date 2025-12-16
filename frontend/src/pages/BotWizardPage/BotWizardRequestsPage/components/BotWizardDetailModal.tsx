import { Modal, Descriptions, Tag, Alert } from 'antd'
import { TempFile } from '@app/types/tempFile.types'
import { WizardStatus } from '@app/enums/botWizard.enum'
import { getStatusColor } from '../helpers'
import { formatDate } from '@app/utils/date'

type Props = {
    open: boolean
    onClose: () => void
    item: TempFile
    status: WizardStatus 
}

export default function BotWizardDetailModal({ open, onClose, item, status }: Props) {
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
                {status === WizardStatus.Expired && (
                    <Alert 
                        message="File Expired" 
                        description="This file has been removed from the server and is no longer available for download." 
                        type="error" 
                        showIcon 
                    />
                )}

                <Descriptions bordered column={1} size='small'>
                    <Descriptions.Item label="File Name">
                        <span className="font-medium">{item.fileName}</span>
                    </Descriptions.Item>
                    <Descriptions.Item label="File ID">
                        <span className="text-xs font-mono text-gray-500">{item.id}</span>
                    </Descriptions.Item>
                    <Descriptions.Item label="Status">
                        <Tag color={getStatusColor(status)}>
                            {status}
                        </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Mime Type">
                        {item.mimeType}
                    </Descriptions.Item>
                    <Descriptions.Item label="Created At">
                        {formatDate(item.createdAt)}
                    </Descriptions.Item>
                    <Descriptions.Item label="Expires At">
                        {formatDate(item.expiredAt)}
                    </Descriptions.Item>
                </Descriptions>
            </div>
        </Modal>
    )
}