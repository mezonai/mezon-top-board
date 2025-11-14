import { ReviewHistoryResponse } from "@app/services/api/reviewHistory/reviewHistory.types"

export const REVIEW_HISTORY_COLUMNS = [
  {
    title: 'Image',
    dataIndex: 'featuredImage',
    key: 'featuredImage'
  },
  {
    title: 'App',
    key: 'app',
    render: (_: any, record: ReviewHistoryResponse) => record?.app?.name || ''
  },
  {
    title: 'Version',
    key: 'version',
    render: (_: any, record: ReviewHistoryResponse) => record?.appVersion?.version ?? '0'
  },
  {
    title: 'Remark',
    dataIndex: 'remark',
    key: 'remark'
  },
  {
    title: 'Review Status',
    key: 'isApproved',
    render: (_: any, record: ReviewHistoryResponse) => record?.isApproved ? 'Approved' : 'Rejected'
  },
  {
    title: 'Reviewer',
    key: 'reviewer',
    render: (_: any, record: ReviewHistoryResponse) => record?.reviewer?.name || ''
  },
  {
    title: 'Reviewed At',
    dataIndex: 'reviewedAt',
    key: 'reviewedAt',
  }
]
