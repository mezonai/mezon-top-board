import React, { useEffect, useState } from 'react'
import { Modal, Form, Input, Descriptions, Space, Spin, Typography } from 'antd'
import Button from '@app/mtb-ui/Button'
import { ReviewHistoryResponse } from '@app/services/api/reviewHistory/reviewHistory.types'
import { formatDate } from '@app/utils/date'

const { TextArea } = Input
const { Paragraph } = Typography

interface Props {
    open: boolean
    isEdit: boolean
    data?: Partial<ReviewHistoryResponse>
    initialRemark?: string
    onClose: () => void
    onSave?: (id: string, remark: string) => Promise<void>
}

const ReviewHistoryModal: React.FC<Props> = ({ open, isEdit, data, initialRemark, onClose, onSave }) => {
    const [form] = Form.useForm()
    const [isUpdating, setIsUpdating] = useState(false)

    useEffect(() => {
        if (!open) {
            form.resetFields()
        } else if (isEdit) {
            form.setFieldsValue({ remark: initialRemark ?? '' })
        }
    }, [open, isEdit, initialRemark, form])

    const handleSave = async () => {
        try {
            const values = await form.validateFields()
            const remark = values.remark
            if (onSave && data?.id) {
                setIsUpdating(true)
                await onSave(data.id, remark)
            }
        } catch (err) {
        } finally {
            setIsUpdating(false)
        }
    }

    const renderFooter = () => (
        <Space>
            <Button onClick={onClose} disabled={isUpdating} variant='outlined'>
                {isEdit ? 'Cancel' : 'Close'}
            </Button>
            {isEdit && (
                <Button type='primary' onClick={handleSave} loading={isUpdating}>
                    Update
                </Button>
            )}
        </Space>
    )

    const renderContent = () => {
        if (isEdit) {
            return (
                <Form form={form} layout='vertical' className='!pt-2'>
                    <Form.Item name='remark' label='Remark' rules={[{ required: true, message: 'This field is required' }]}>
                        <TextArea
                            autoSize={false}
                            rows={4}
                            className='!resize-none'
                            placeholder='Update your remark...'
                        />
                    </Form.Item>
                </Form>
            )
        }

        if (!data) {
            return (
                <div className='text-center py-8'>
                    <Spin size='large' />
                </div>
            )
        }

        return (
            <Descriptions
                bordered
                size='small'
                column={1}
                labelStyle={{ backgroundColor: 'var(--bg-container-secondary)', color: 'var(--text-primary)', fontWeight: 700, width: '120px', verticalAlign: 'top' }}
                contentStyle={{ backgroundColor: 'var(--bg-container)', color: 'var(--text-primary)' }}
            >
                <Descriptions.Item label='Version'>
                    {data.appVersion?.version ?? '0'}
                </Descriptions.Item>
                <Descriptions.Item label='App'>
                    {data.app?.name ?? '-'}
                </Descriptions.Item>
                <Descriptions.Item label='Reviewer'>
                    {data.reviewer?.name ?? 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label='Reviewed At'>
                    {formatDate(data.reviewedAt)}
                </Descriptions.Item>
                <Descriptions.Item label='Remark'>
                    <Paragraph style={{ whiteSpace: 'pre-wrap', marginBottom: 0, minHeight: '80px' }}>
                        {data.remark || '-'}
                    </Paragraph>
                </Descriptions.Item>
            </Descriptions>
        )
    }

    return (
        <Modal
            title={isEdit ? 'Edit History' : 'View history'}
            open={open}
            onCancel={onClose}
            footer={renderFooter()}
            width={600}
            centered
        >
            {renderContent()}
        </Modal>
    )
}

export default ReviewHistoryModal