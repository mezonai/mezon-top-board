import { DeleteOutlined, EditOutlined, EyeOutlined, SearchOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import {
  useLazyReviewHistoryControllerSearchAppReviewsQuery,
  useReviewHistoryControllerDeleteAppReviewMutation,
  useReviewHistoryControllerUpdateAppReviewMutation
} from '@app/services/api/reviewHistory/reviewHistory'
import { ReviewHistoryResponse } from '@app/services/api/reviewHistory/reviewHistory.types'
import { Input, Popconfirm, Table, Tag, Tooltip, Typography } from 'antd'
import Button from '@app/mtb-ui/Button'
import sampleBotImg from '@app/assets/images/avatar-bot-default.png'
import { getUrlMedia } from '@app/utils/stringHelper'
import { formatDate } from '@app/utils/date'
import { useEffect, useState } from 'react'
import ReviewHistoryModal from './ReviewHistoryModal'
import { toast } from 'react-toastify'

function ReviewHistoryPage() {
  const [getReviewHistory, { data }] = useLazyReviewHistoryControllerSearchAppReviewsQuery()
  const [getReviewHistoryDetail, { data: reviewHistoryDetail }] = useLazyReviewHistoryControllerSearchAppReviewsQuery()
  const [updateReviewHistory] = useReviewHistoryControllerUpdateAppReviewMutation()
  const [deleteReviewHistory] = useReviewHistoryControllerDeleteAppReviewMutation()
  const [currentPageNumber, setCurrentPageNumber] = useState<number>(1)
  const [currentPageSize, setCurrentPageSize] = useState<number>(5)
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false)
  const [isEdit, setIsEdit] = useState<boolean>(false)
  const [selectedHistory, setSelectedHistory] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState<string>('');

  const fetchData = async () => {
    getReviewHistory({
      search: searchQuery,
      pageNumber: currentPageNumber,
      pageSize: currentPageSize,
      sortField: 'createdAt',
      sortOrder: 'DESC'
    })
  }

  useEffect(() => {
    fetchData()
  }, [currentPageSize, currentPageNumber])

  const handleSearchSubmit = () => {
    setCurrentPageNumber(1);
    fetchData();
  }

  const handleView = (id: string) => {
    setIsEdit(false)
    getReviewHistoryDetail({
      appId: id,
      pageNumber: 1,
      pageSize: 1,
      sortField: 'createdAt',
      sortOrder: 'DESC'
    })
    setIsOpenModal(true)
  }

  const handleEdit = (id: string) => {
    setSelectedHistory(id)
    setIsEdit(true)
    setIsOpenModal(true)
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteReviewHistory({
        requestWithId: {
          id
        }
      })
      toast.success('Delete history successfull')
      await fetchData()
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to edit history')
    }
  }

  const handleUpdate = async (id: string, newRemark: string) => {
    try {
      await updateReviewHistory({
        updateAppReviewRequest: {
          id,
          remark: newRemark
        }
      })
      toast.success('Update history successfull')
      setIsOpenModal(false)
      await fetchData()
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to edit history')
    }
  }

  const dataHistoryTable = data?.data || []

  const columns: ColumnsType<ReviewHistoryResponse> = [
    {
      title: 'Image',
      dataIndex: 'featuredImage',
      key: 'featuredImage',
      render: (_: any, record: ReviewHistoryResponse) => (
        <img
          src={record.app?.featuredImage ? getUrlMedia(record.app.featuredImage) : sampleBotImg}
          alt={record.app?.name}
          style={{ width: 100, display: 'block', margin: '0 auto' }}
        />
      )
    },
    {
      title: 'App',
      key: 'app',
      render: (_: any, record: ReviewHistoryResponse) => (
        <div className='break-words max-w-[80px] 2xl:max-w-[120px]'>
          {record?.app?.name || ''}
        </div>
      )
    },
    {
      title: 'Version',
      align: 'center',
      key: 'version',
      render: (_: any, record: ReviewHistoryResponse) => (
        <div className='text-center'>{record.appVersion?.version ?? '-'}</div>
      )
    },
    {
      title: 'Remark',
      dataIndex: 'remark',
      key: 'remark',
      render: (_: any, record: ReviewHistoryResponse) => (
        <Typography.Paragraph ellipsis={{ rows: 2, expandable: false }}>
          {record.remark || '-'}
        </Typography.Paragraph>
      )
    },
    {
      title: 'Review Status',
      key: 'isApproved',
      render: (_: any, record: ReviewHistoryResponse) => (
        <Tag color={record.isApproved ? 'green' : 'red'}>
          {record.isApproved ? 'Approved' : 'Rejected'}
        </Tag>
      )
    },
    {
      title: 'Reviewer',
      key: 'reviewer',
      render: (_: any, record: ReviewHistoryResponse) => (
        <div className='break-words max-w-[80px] 2xl:max-w-[120px]'>
          {record?.reviewer?.name || ''}
        </div>
      )
    },
    {
      title: 'Reviewed At',
      dataIndex: 'reviewedAt',
      key: 'reviewedAt',
      align: 'center',
      render: (_: any, record: ReviewHistoryResponse) => (
        <div className='text-center'>{formatDate(record.reviewedAt, 'DD-MM-YYYY')}</div>
      )
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: ReviewHistoryResponse) => (
        <div className='flex gap-3'>
          <Tooltip title='View'>
            <Button
              color='cyan'
              variant='outlined'
              icon={<EyeOutlined />}
              onClick={() => handleView(record.app.id || '')}
            />
          </Tooltip>
          <Tooltip title='Edit'>
            <Button
              color='blue'
              variant='solid'
              icon={<EditOutlined />}
              onClick={() => handleEdit(record.id || '')}
            />
          </Tooltip>
          <Popconfirm
            title='Delete the history'
            description='Are you sure to delete this history?'
            onConfirm={() => handleDelete(record?.id)}
            okText='Yes'
            cancelText='No'
          >
            <Tooltip title='Delete'>
              <Button color='danger' variant='solid' icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </div>
      )
    }
  ]

  return (
    <>
      <div className='flex gap-4 mb-3'>
        <Input
          placeholder='Search by name or email'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          prefix={<SearchOutlined className='text-text-secondary' />}
          onPressEnter={handleSearchSubmit}
          className='w-full'
          style={{ borderRadius: '8px', height: '40px' }}
        />
        <Button className="w-50"
          size="large"
          type='primary'
          onClick={handleSearchSubmit}
          icon={<SearchOutlined />}
        >
          Search
        </Button>
      </div>
      <Table
        dataSource={dataHistoryTable}
        columns={columns}
        rowKey='id'
        pagination={{
          current: currentPageNumber,
          pageSize: currentPageSize,
          total: data?.totalCount,
          showSizeChanger: true,
          pageSizeOptions: ['5', '10', '15'],
          showTotal: (total) => `Total ${total} items`,
          onChange: (page, pageSize) => {
            setCurrentPageNumber(page)
            setCurrentPageSize(pageSize || 5)
          }
        }}
        className='cursor-pointer'
      ></Table>
      <ReviewHistoryModal
        open={isOpenModal}
        isEdit={isEdit}
        data={isEdit ? { id: selectedHistory } : reviewHistoryDetail?.data?.[0]}
        onClose={() => setIsOpenModal(false)}
        onSave={handleUpdate}
      />
    </>
  )
}

export default ReviewHistoryPage
