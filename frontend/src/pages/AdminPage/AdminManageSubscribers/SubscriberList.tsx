import { Form, Input, Popconfirm, Table} from 'antd'
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import MtbTypography from '@app/mtb-ui/Typography/Typography'

import MtbButton from '@app/mtb-ui/Button'
import { useMemo, useState } from 'react'
import { useMailControllerGetAllMailsQuery } from '@app/services/api/mail/mail'
import { toast } from 'react-toastify'
import CreateSubscriberModal from '@app/pages/AdminPage/AdminManageSubscribers/components/CreateSubscriberModal'
import EditSubscriberModal from '@app/pages/AdminPage/AdminManageSubscribers/components/EditSubscriberModal'
import { Subscriber, useSubscribeControllerDeleteSubscriberMutation, useSubscribeControllerGetAllSubscriberQuery } from '@app/services/api/subscribe/subscribe'
import Checkbox from '@app/pages/AdminPage/AdminManageMailSchedule/components/Checkbox'

const pageOptions = [5, 10, 15]

function SubscriberList() {

  const [isOpenModal, setIsOpenModal] = useState<boolean>(false)
  const [isOpenEditModal, setIsOpenEditModal] = useState<boolean>(false)
  const [page, setPage] = useState<number>(1)
  const [botPerPage, setBotPerPage] = useState<number>(pageOptions[0])
  const [currentSubscriber, setCurrentSubscriber] = useState<Subscriber>()

  const { data: subscriberData } = useSubscribeControllerGetAllSubscriberQuery()
  const { refetch } = useMailControllerGetAllMailsQuery()
  const [deleteSubscriber] = useSubscribeControllerDeleteSubscriberMutation()
  const totals = useMemo(() => subscriberData?.totalCount || 0, [subscriberData])

  const handlePageChange = (newPage: number, newPageSize?: number) => {
    setPage(newPage);
    if (newPage > Math.ceil(totals / botPerPage)) {
      setPage(1)
    }
    if (newPageSize) {
      setBotPerPage(newPageSize);
    }
  }
  
  const handleDelete = async (id: string) => {
      try {
        await deleteSubscriber(id).unwrap()
        await refetch()
        toast.success('Subscriber deleted')
      } catch {
        toast.error('Cannot delete subscriber. It might be in use.')
      }
  }

  const handleOpenEditModal = (subscriber: Subscriber) => {
    setCurrentSubscriber(subscriber)
    setIsOpenEditModal(true)
  }

  const columns = [
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (text: string) =>
        <span>{text}</span>
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (text: string) =>
        <span>{text}</span>
    },
    {
      title: 'Subscribed At',
      dataIndex: 'subscribedAt',
      key: 'subscribedAt',
      render: (text: string) =>
        <span>{text}</span>
    },
    {
      title: 'Repeatable',
      dataIndex: 'isRepeatable',
      key: 'isRepeatable',
      render: (isRepeatable: boolean) =>
        <Checkbox checked={isRepeatable} disabled />
    },
    {
      title: 'Actions',
      key: 'actions',
      width: '10%',
      render: (_: any, record: Subscriber) =>
        <div className='flex gap-2'>
            <MtbButton color="blue" 
              icon={<EditOutlined />}
              onClick={() => handleOpenEditModal(record)}
            />
            <Popconfirm title='Delete this mail?' onConfirm={() => handleDelete(record.id)} okText='Yes' cancelText='No'>
              <MtbButton color='danger'  icon={<DeleteOutlined />} />
            </Popconfirm>
          </div>
    }
  ]

  const handleCancel = () => {
    setIsOpenModal(false)
    setIsOpenEditModal(false)
  }

  return (
    <div>
      <h2 className='font-bold text-lg mb-4'>Manage Subscribers</h2>
      <div className='flex gap-2'>
        <Form initialValues={{ search: '' }} className='flex-grow'>
          <Form.Item name='search' className='w-full'>
            <Input
              placeholder='Search by Email'
              prefix={<SearchOutlined style={{ color: '#bbb' }} />}
            />
          </Form.Item>
        </Form>
        <MtbButton icon={<SearchOutlined />} color='default' variant='outlined'>
          Search
        </MtbButton>
        <MtbButton variant='outlined' icon={<PlusOutlined /> } onClick={() => setIsOpenModal(true)}>
          Add New Subscriber
        </MtbButton>
      </div>

       {subscriberData?.data?.length ? (
        <Table dataSource={subscriberData.data} columns={columns} rowKey='id' 
          pagination={{
            current: page,
            pageSize: botPerPage,
            total: totals,
            onChange: handlePageChange,
            showSizeChanger: true,
            pageSizeOptions: pageOptions.map(String)
          }}
          />
      ) : (
        <MtbTypography variant='h4' weight='normal' customClassName='!text-center !block !text-gray-500'>
          No result
        </MtbTypography>
      )}
      
      <CreateSubscriberModal
        open={isOpenModal}
        onClose={handleCancel}
      />

      <EditSubscriberModal
        selectSubscriber={currentSubscriber}
        open={isOpenEditModal}
        onClose={handleCancel}
      />
    </div>
  )
}

export default SubscriberList
