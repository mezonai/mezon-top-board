import React, { useState, useEffect } from 'react'
import { Modal, Button, Input, Popconfirm, Descriptions, Form, Space } from 'antd'
import { toast } from 'react-toastify'
import { useMezonAppControllerUpdateMezonAppMutation, mockAppVersions } from './mockData'
import { formatDate } from '@app/utils/date'

const { TextArea } = Input

interface Props {
  open: boolean
  onClose: () => void
  appId?: string
  onUpdated?: () => void
}

const AppReviewModal: React.FC<Props> = ({ open, onClose, appId, onUpdated }) => {
  const [form] = Form.useForm()
  const remark = Form.useWatch('remark', form) 

  const [loading, setLoading] = useState(false)
  const [updateApp] = useMezonAppControllerUpdateMezonAppMutation()

  const latestVersion = React.useMemo(() => {
    if (!appId) return undefined
    const versions = mockAppVersions.filter(v => v.appId === appId && !v.deletedAt)
    versions.sort((a, b) => (b.version || 0) - (a.version || 0))
    return versions[0]
  }, [appId])

  useEffect(() => {
    if (!open) {
      form.resetFields()
    }
  }, [open, form])

  const submit = async (action: 'approve' | 'reject') => {
    if (!appId) return
    setLoading(true)
    try {
      const status = action === 'approve' ? 'PUBLISHED' : 'REJECTED'

      // TODO: SEND REQUEST TO BACKEND TO UPDATE APP STATUS
      await updateApp({
        updateMezonAppRequest: {
          id: appId,
          status,
          remark: remark || null 
        }
      })

      toast.success(action === 'approve' ? 'App approved' : 'App rejected')
      onUpdated && onUpdated()
      onClose()
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to review')
    } finally {
      setLoading(false)
    }
  }

  const renderFooter = () => (
    <Space>
      <Button onClick={onClose} disabled={loading}>
        Cancel
      </Button>
      <Popconfirm title='Reject this app?' onConfirm={() => submit('reject')} okText='Yes' cancelText='No'>
        <Button danger loading={loading}>
          Reject
        </Button>
      </Popconfirm>
      <Button type='primary' onClick={() => submit('approve')} loading={loading}>
        Approve
      </Button>
    </Space>
  )

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={renderFooter()} 
      width={600}
      centered
      title='Review app'
    >
      <Descriptions bordered size="small" column={1}>
        <Descriptions.Item label="Version">
          {latestVersion?.version ?? '0'}
        </Descriptions.Item>
        <Descriptions.Item label="Submitted">
          {formatDate(latestVersion?.createdAt)}
        </Descriptions.Item>
        <Descriptions.Item label="Change Log"> 
          {latestVersion?.changelog || 'none'}
        </Descriptions.Item>
      </Descriptions>

      <Form form={form} layout="vertical" style={{ marginTop: 24 }}>
        <Form.Item
          name="remark"
          label="Remark (optional)"
        >
          <TextArea rows={4} placeholder='Provide a reason for rejection or approval...' />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default AppReviewModal