import React from 'react'
import { Table } from 'antd'
import CampaignActions from './CampaignActions'
import { NewsletterCampaign } from '@app/services/api/newsletterCampaign/newsletterCampaign'

interface CampaignTableProps {
  data: NewsletterCampaign[]
  loading: boolean
  total: number
  page: number
  pageSize: number
  onPageChange: (page: number, pageSize?: number) => void
  onView: (record: NewsletterCampaign) => void
  onEdit: (record: NewsletterCampaign) => void
  onDelete: (record: NewsletterCampaign) => Promise<void>
}

const CampaignTable: React.FC<CampaignTableProps> = ({
  data,
  loading,
  total,
  page,
  pageSize,
  onPageChange,
  onView,
  onEdit,
  onDelete
}) => {
  return (
    <Table
      rowKey='id'
      loading={loading}
      style={{ backgroundColor: "transparent"}}
      dataSource={data}
      pagination={{
        current: page,
        pageSize,
        total,
        onChange: onPageChange
      }}
      columns={[
        {
          title: 'Title',
          dataIndex: 'title'
        },
        {
          title: 'Headline',
          dataIndex: 'headline'
        },
        {
          title: 'Description',
          dataIndex: 'description',
          ellipsis: true
        },

        {
          title: 'Created At',
          dataIndex: 'createdAt',
          render: (date: string) => new Date(date).toLocaleString()
        },
        {
          title: 'Actions',
          render: (_: any, record: NewsletterCampaign) => (
            <CampaignActions
              onView={() => onView(record)}
              onEdit={() => onEdit(record)}
              onDelete={() => onDelete(record)}
            />
          )
        }
      ]}
    />
  )
}

export default CampaignTable
