import React, { useState, useEffect } from 'react'
import { Modal, Button, Input, Descriptions, Form, Space } from 'antd'
import { toast } from 'react-toastify'
import { GetMezonAppDetailsResponse, useMezonAppControllerUpdateMezonAppMutation, AppVersion } from '@app/services/api/mezonApp/mezonApp'
import { formatDate } from '@app/utils/date'
import { AppStatus } from '@app/enums/AppStatus.enum'

const { TextArea } = Input

interface Props {
  open: boolean
  onClose: () => void
  appData?: GetMezonAppDetailsResponse | undefined
  latestVersion?: AppVersion
  onUpdated?: () => void
}

const AppReviewModal: React.FC<Props> = ({ open, onClose, onUpdated, appData, latestVersion }) => {
  const [form] = Form.useForm()
  const remark = Form.useWatch('remark', form)

  const [loading, setLoading] = useState(false)
  const [reviewAppId] = useMezonAppControllerUpdateMezonAppMutation()

  useEffect(() => {
    if (!open) {
      form.resetFields()
    }
  }, [open, form])

  const submit = async (action: AppStatus.APPROVED | AppStatus.REJECTED) => {
    if (!appData?.id) return
    setLoading(true)
    try {
      const status = action === AppStatus.APPROVED ? AppStatus.APPROVED : AppStatus.REJECTED

      // TODO: SEND REQUEST TO BACKEND TO UPDATE APP STATUS
      await reviewAppId({
        updateMezonAppRequest: {
          id: appData.id,
          status,
          remark: remark || null,
        }
      })

      toast.success(action === AppStatus.APPROVED ? 'App approved' : 'App rejected')
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
      <Button danger loading={loading} onClick={() => submit(AppStatus.REJECTED)}>
        Reject
      </Button>
      <Button type='primary' onClick={() => submit(AppStatus.APPROVED)} loading={loading}>
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
      style={{ backgroundColor: '#f6f8fb' }}
    >
      <Descriptions
        bordered
        size="small"
        column={1}
        labelStyle={{ backgroundColor: '#f3f5f7', color: '#374151', fontWeight: 700 }}
        contentStyle={{ backgroundColor: '#ffffff', color: '#111827' }}
      >
        <Descriptions.Item label="Version">
          {latestVersion?.version ?? '0'}
        </Descriptions.Item>
        <Descriptions.Item label="Submitted">
          {formatDate(appData?.updatedAt)}
        </Descriptions.Item>
        <Descriptions.Item label="Change Log">
          <div style={{ backgroundColor: '#ffffff', borderRadius: 6 }}>
            {latestVersion?.changelog || '-'}
          </div>
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