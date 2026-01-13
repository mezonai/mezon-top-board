import { RootState } from '@app/store'
import { Checkbox, Form, Input, InputRef, Popconfirm, Select, Table} from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import TableActionButton from '@app/components/TableActionButton/TableActionButton'
import { useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import MailScheduleModal from '@app/pages/AdminPage/AdminManageMailSchedule/components/MailScheduleModal'

import { useAppDispatch, useAppSelector } from '@app/store/hook'
import { setSearchMailTemplateList } from '@app/store/mailTemplate'
import { RepeatInterval } from '@app/enums/subscribe'
import { useLazyMailTemplateControllerGetAllMailsQuery, useLazyMailTemplateControllerGetMailsSearchQuery, useMailTemplateControllerDeleteMailMutation } from '@app/services/api/marketingMail/marketingMail'
import { MailTemplate } from '@app/types'

const pageOptions = [5, 10, 15]

interface SearchFormValues {
  search: string,
  pageSize: 5 | 10 | 15,
  pageNumber: number,
}

function MailScheduleList() {
  const dispatch = useAppDispatch();
  const [botPerPage, setBotPerPage] = useState<number>(pageOptions[0])
  const [currentMail, setCurrentMail] = useState<MailTemplate>()
  const [getMailTemplateData] = useLazyMailTemplateControllerGetAllMailsQuery()
  const [deleteMail] = useMailTemplateControllerDeleteMailMutation()
  const [searchMailTemplate] = useLazyMailTemplateControllerGetMailsSearchQuery()
  const searchMailsList = useAppSelector((state: RootState) => state.mailTemplate.searchMailTemplateList)

  const [searchForm] = Form.useForm<SearchFormValues>()

  const initialValues: SearchFormValues = {
    search: '',
    pageSize: 5,
    pageNumber: 1,
  };

  const searchRef = useRef<InputRef>(null)
  
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false)
  const [page, setPage] = useState<number>(1)

  const totals = useMemo(() => searchMailsList?.totalCount || 0, [searchMailsList])

  useEffect(() => {
    searchMailTemplateList()
  }, [page, botPerPage])
  useEffect(() => {
    getMailTemplateData()
  }, [])
  
  const handleDelete = async (id: string) => {
    try {
      await deleteMail({id}).unwrap()
      searchMailTemplateList()
      toast.success('Mail schedule deleted')
    } catch {
      toast.error('Cannot delete mail schedule. It might be in use.')
    }
  }

  const handleOpenEditModal = (mail: MailTemplate) => {
    setCurrentMail(mail)
    setIsOpenModal(true)
  }

  const handleCancel = () => {
    setCurrentMail(undefined)
    setIsOpenModal(false)
  }

  const handleSearch = () => {
    setPage(1)
    searchMailTemplateList(1)
  }

  const searchMailTemplateList = async (pageNumber?: number) => {
    const formValues = searchForm.getFieldsValue()
    const result = await searchMailTemplate({
      search: formValues.search || '',
      pageNumber: pageNumber ?? page,
      pageSize: botPerPage
    }).unwrap()

    dispatch(setSearchMailTemplateList(result));
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
      title: 'Subject',
      dataIndex: 'subject',
      key: 'subject',
      render: (text: string) =>
        <span className="text-primary">{text}</span>
    },
    {
      title: 'Repeatable',
      dataIndex: 'isRepeatable',
      key: 'isRepeatable',
      render: (isRepeatable: boolean) =>
        <Checkbox checked={isRepeatable} disabled />
    },
    {
      title: 'Repeat Interval',
      dataIndex: 'repeatInterval',
      key: 'repeatInterval',
      render: (text: RepeatInterval) =>
        <span className="text-secondary">{text || '-'}</span>
    },
    {
      title: 'Actions',
      key: 'actions',
      width: '120px',
      render: (_: any, record: MailTemplate) =>
        <div className='flex gap-2'>
          <TableActionButton
            actionType="edit"
            onClick={() => handleOpenEditModal(record)}
          />
          <Popconfirm 
            title='Delete this mail?'
            onConfirm={() => handleDelete(record.id)} 
            okText='Yes' 
            cancelText='No'
            overlayClassName='bg-container text-primary'
          >
            <TableActionButton 
              actionType="delete" 
            />
          </Popconfirm>
        </div>
    }
  ]

  return (
    <div className="p-4 rounded-md shadow-md bg-container">
      <h2 className='font-bold text-lg mb-4 text-primary'>Manage Mail Schedule Templates</h2>
      
      {/* Search & Filter Section */}
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
                placeholder='Search by subject'
                prefix={<SearchOutlined className='text-secondary' />}
                onPressEnter={() => searchForm.submit()}
                className='w-full rounded-[8px] h-[40px] bg-container text-primary  placeholder:text-secondary'
              />
            </Form.Item>
            <Form.Item name='sortField' className='w-full md:w-48 mb-0'>
              <Select 
              size='large'
                className='w-full h-[40px]'
                placeholder='Repeat Interval'
                popupClassName='bg-container text-primary'
                dropdownStyle={{ background: 'var(--bg-container)', color: 'var(--text-primary)' }}
                allowClear
              >
                {Object.values(RepeatInterval).map((status) => (
                  <Select.Option key={status} value={status} className="text-primary hover:bg-secondary">
                    {status}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item className='w-full md:w-auto mb-0'>
              <TableActionButton
                actionType='search'
                htmlType='submit'
                className='w-full md:w-auto'
              >
                Search
              </TableActionButton>
            </Form.Item>
            <Form.Item className='w-full md:w-auto mb-0 md:ml-auto'>
              <TableActionButton 
                actionType='add' 
                onClick={() => setIsOpenModal(true)}
                className="w-full md:w-auto"
              >
                Add New Mail
              </TableActionButton>
            </Form.Item>
          </div>
        </Form>
      </div>

      {searchMailsList?.data?.length ? (
        <Table 
          dataSource={searchMailsList.data} 
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
      
      <MailScheduleModal
        refetch={searchMailTemplateList}
        selectMail={currentMail}
        open={isOpenModal}
        onClose={handleCancel}
      />
    </div>
  )
}

export default MailScheduleList