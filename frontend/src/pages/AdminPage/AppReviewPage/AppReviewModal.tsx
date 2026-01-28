import React, { useEffect } from 'react'
import { Modal, Input, Descriptions, Form, Space } from 'antd'
import Button from '@app/mtb-ui/Button'
import { toast } from 'react-toastify'
import { AppVersionDetailsDto, GetMezonAppDetailsResponse } from '@app/services/api/mezonApp/mezonApp.types'
import { formatDate } from '@app/utils/date'
import { AppStatus } from '@app/enums/AppStatus.enum'
import { useReviewHistoryControllerCreateAppReviewMutation } from '@app/services/api/reviewHistory/reviewHistory'
import { Typography } from 'antd'

const { TextArea } = Input

interface Props {
  open: boolean
  onClose: () => void
  appData?: GetMezonAppDetailsResponse | undefined
  latestVersion?: AppVersionDetailsDto
  onUpdated?: () => void
}

const AppReviewModal: React.FC<Props> = ({ open, onClose, onUpdated, appData, latestVersion }) => {
  const [form] = Form.useForm()
  const remark = Form.useWatch('remark', form)

  const [createReviewHistory, {
    isLoading: isCreatingReviewHistory,
    error: createReviewHistoryError,
    isSuccess: isReviewHistoryCreated,
  }] = useReviewHistoryControllerCreateAppReviewMutation()

  useEffect(() => {
    if (!open) {
      form.resetFields()
    }
  }, [open, form])

  const submit = async (action: AppStatus.APPROVED | AppStatus.REJECTED) => {
    if (!appData?.id) {
      toast.error('Invalid app id')
      return
    }
    try {
      const isApproved = action === AppStatus.APPROVED

      await createReviewHistory({
        createAppReviewRequest: {
          appId: appData.id,
          isApproved: isApproved,
          remark: remark || null,
        }
      }).unwrap()

      toast.success(action === AppStatus.APPROVED ? 'App approved' : 'App rejected')
      onUpdated && onUpdated()
      onClose()
    } catch (err: any) {
      toast.error(err?.data?.message?.[0] || 'Failed to review')
    }
  }

  const renderFooter = () => (
    <Space>
      <Button variant='outlined' onClick={onClose} disabled={isCreatingReviewHistory}>
        Cancel
      </Button>
      <Button danger variant='outlined' loading={isCreatingReviewHistory} onClick={() => submit(AppStatus.REJECTED)}>
        Reject
      </Button>
      <Button type='primary' variant='solid' onClick={() => submit(AppStatus.APPROVED)} loading={isCreatingReviewHistory}>
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
      <Descriptions
        bordered
        size="small"
        column={1}
        styles={{
            label: { backgroundColor: 'var(--bg-container-secondary)', color: 'var(--text-primary)', fontWeight: 700 },
            content: { backgroundColor: 'var(--bg-container)', color: 'var(--text-primary)' }
        }}
      >
        <Descriptions.Item label="Version">
          {latestVersion?.version ?? '0'}
        </Descriptions.Item>
        <Descriptions.Item label="Submitted">
          {formatDate(appData?.versions?.[0]?.updatedAt)}
        </Descriptions.Item>
        <Descriptions.Item label="Change Log">
          <Typography.Paragraph 
            style={{ whiteSpace: 'pre-wrap', marginBottom: 0 }}
          >
            {latestVersion?.changelog || '-'}
          </Typography.Paragraph>
        </Descriptions.Item>
      </Descriptions>

      <Form form={form} layout="vertical" style={{ marginTop: 24 }}>
        <Form.Item
          name="remark"
          label="Remark"
          required
        >
          <TextArea rows={4} placeholder='Provide a reason for rejection or approval...' />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default AppReviewModal