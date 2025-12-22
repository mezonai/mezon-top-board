import { RootState } from '@app/store'
import { Form, Input, InputRef, Popconfirm, Select, Table, Tag } from 'antd'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { SearchOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { useAppDispatch, useAppSelector } from '@app/store/hook'
import { toast } from 'react-toastify'
import MtbButton from '@app/mtb-ui/Button'
import { EmailSubscriptionStatus } from '@app/enums/subscribe'
import { IEmailSubscriberStore, setSearchSubscriberList } from '@app/store/emailSubscriber'
import { useEmailSubscribeControllerDeleteMutation, useEmailSubscribeControllerUpdateSubscriberMutation, useLazyEmailSubscribeControllerGetAllSubscribersQuery, useLazyEmailSubscribeControllerSearchSubscriberQuery } from '@app/services/api/emailSubscribe/emailSubscribe'
import { EmailSubscriber } from '@app/types'
const pageOptions = [5, 10, 15]

interface SearchFormValues {
  search: string,
  pageSize: 5 | 10 | 15,
  pageNumber: number,
}

function EmailSubscriberList() {
  const dispatch = useAppDispatch();
  const [getEmailSubscribers] = useLazyEmailSubscribeControllerGetAllSubscribersQuery()
  const [updateEmailSubscriber] = useEmailSubscribeControllerUpdateSubscriberMutation()
  const [deleteEmailSubscriber] = useEmailSubscribeControllerDeleteMutation()
  const [searchEmailSubscriber] = useLazyEmailSubscribeControllerSearchSubscriberQuery()
  const searchEmailSubscriberList = useAppSelector((state: RootState) => state.emailSubscriber.searchSubscriberList)

  const [searchForm] = Form.useForm<SearchFormValues>()

  const initialValues: SearchFormValues = {
    search: '',
    pageSize: 5,
    pageNumber: 1,
  };

  const { subscriberList } = useSelector<RootState, IEmailSubscriberStore>((s) => s.emailSubscriber)
  const searchRef = useRef<InputRef>(null)

  const [editingSubscriber, setEditingSubscriber] = useState<{
    id: string | null
    status?: EmailSubscriptionStatus
  }>({ id: null })

  const [page, setPage] = useState<number>(1)
  const [botPerPage, setBotPerPage] = useState<number>(pageOptions[0])

  useEffect(() => {
    searchSubscribersList()
  }, [page, botPerPage])
  useEffect(() => {
    getEmailSubscribers()
  }, [])

  const totals = useMemo(() => searchEmailSubscriberList?.totalCount || 0, [searchEmailSubscriberList])

  const handleUpdate = async (id: string) => {
    try {
      await updateEmailSubscriber({
        id,
        updateSubscriptionRequest: {
          status: editingSubscriber.status!
        }
      }).unwrap()
      setEditingSubscriber({ id: null })
      await searchSubscribersList(page)
      toast.success('Subscriber updated')
    } catch {
      toast.error('Failed to update subscriber')
    }
  }

  const handleDelete = async (id: string) => {
    if (subscriberList?.data?.some((subscriber: EmailSubscriber) => subscriber.id === id && subscriber.status === EmailSubscriptionStatus.ACTIVE)) {
      toast.error('Subscriber is active and cannot be deleted')
      return
    }
    try {
      await deleteEmailSubscriber({ id }).unwrap()
      await searchSubscribersList(page)
      toast.success('Subscriber deleted')
    } catch {
      toast.error('Cannot delete subscriber. It might be in use.')
    }
  }

  const handleSearch = () => {
    setPage(1)
    searchSubscribersList(1)
  }

  const searchSubscribersList = async (pageNumber?: number) => {
    const formValues = searchForm.getFieldsValue()
    const result = await searchEmailSubscriber({
      search: formValues.search || '',
      pageNumber: pageNumber ?? page,
      pageSize: botPerPage,
    }).unwrap()

    dispatch(setSearchSubscriberList(result));
  }
  
  const handlePageChange = (newPage: number, newPageSize?: number) => {
    setPage(newPage);
    if (newPage > Math.ceil(totals / botPerPage)) {
      setPage(1)
    }
    if (newPageSize) {
      setBotPerPage(newPageSize);
    }
  }

  const columns = [
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (text: string) =>
        <Tag className="bg-secondary text-primary border-border">{text}</Tag>
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (text: string, record: any) =>
        editingSubscriber.id === record.id ? (
          <Select
            value={editingSubscriber.status}
            onChange={(value) => setEditingSubscriber((prev) => ({ ...prev, status: value }))}
            className="w-32"
            popupClassName="bg-container text-primary"
            dropdownStyle={{ background: 'var(--bg-container)', color: 'var(--text-primary)' }}
          >
            {Object.values(EmailSubscriptionStatus).map((status) => (
              <Select.Option key={status} value={status}>
                {status}
              </Select.Option>
            ))}
          </Select>
        ) : (
          <span className="text-primary">{text}</span>
        )
    },
    {
      title: 'Actions',
      key: 'actions',
      width: '20%',
      render: (_: any, record: any) =>
        editingSubscriber.id === record.id ? (
          <div className='flex gap-2'>
            <MtbButton 
              color="blue"
              onClick={() => handleUpdate(record.id)}
            >
              Save
            </MtbButton>
            <MtbButton 
              color='danger'
              onClick={() => setEditingSubscriber({ id: null, status: undefined })}
            >
              Cancel
            </MtbButton>
          </div>
        ) : (
          <div className='flex gap-2'>
            <MtbButton 
              variant="solid"
              color="blue"
              icon={<EditOutlined />}
              onClick={() => setEditingSubscriber({ id: record.id, status: record.status })}
            />
            <Popconfirm 
              title='Delete this subscriber?' 
              onConfirm={() => handleDelete(record.id)} 
              okText='Yes' 
              cancelText='No'
              overlayClassName='bg-container text-primary'
            >
              <MtbButton 
                variant="solid"
                color="danger"
                icon={<DeleteOutlined />} 
              />
            </Popconfirm>
          </div>
        )
    }
  ]

  return (
    <div className="p-4 rounded-md shadow-md bg-container">
      <h2 className='font-bold text-lg mb-4 text-primary'>Manage Email Subscribers</h2>
      
      {/* Search & Filter Form */}
      <div className='mb-4'>
        <Form 
          form={searchForm} 
          onFinish={handleSearch}           
          initialValues={initialValues}
          className='w-full'
        >
          <div className='flex flex-col md:flex-row items-center gap-3 w-full'>
            <Form.Item name='search' className='w-full md:flex-1 mb-0'>
              <Input
                ref={searchRef}
                placeholder='Search by email'
                prefix={<SearchOutlined className='text-secondary' />}
                onPressEnter={() => searchForm.submit()}
                className='w-full rounded-[8px] h-[40px] bg-container text-primary border-border placeholder:text-secondary'
              />
            </Form.Item>
            <Form.Item name='sortField' className='w-full md:w-48 mb-0'>
              <Select 
                className='w-full h-[40px]'
                placeholder='Status'
                popupClassName='bg-container text-primary'
                dropdownStyle={{ background: 'var(--bg-container)', color: 'var(--text-primary)' }}
                allowClear
              >
                {Object.values(EmailSubscriptionStatus).map((status) => (
                  <Select.Option key={status} value={status}>
                    {status}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item className='w-full md:w-auto mb-0'>
              <MtbButton 
                htmlType='submit'
                icon={<SearchOutlined />}
                className='w-full md:w-auto h-[40px]'
              >
                Search
              </MtbButton>
            </Form.Item>
          </div>
        </Form>
      </div>

      {searchEmailSubscriberList?.data?.length ? (
        <Table 
          dataSource={searchEmailSubscriberList.data} 
          columns={columns} 
          rowKey='id'
          pagination={{
            current: page,
            pageSize: botPerPage,
            total: totals,
            onChange: handlePageChange,
            showSizeChanger: true,
            pageSizeOptions: pageOptions.map(String)
          }} 
          scroll={{ x: 'max-content' }}
          className="admin-table"
        />
      ) : (
        <div className='text-center p-8 text-secondary'>
          <p>No result found</p>
        </div>
      )}

    </div>
  )
}

export default EmailSubscriberList