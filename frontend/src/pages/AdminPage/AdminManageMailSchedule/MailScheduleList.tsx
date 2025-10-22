import { RootState } from '@app/store'
import { Button, Checkbox, Form, Input, InputRef, Popconfirm, Select, Table} from 'antd'
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import MtbTypography from '@app/mtb-ui/Typography/Typography'
import MtbButton from '@app/mtb-ui/Button'
import { useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import MailScheduleModal from '@app/pages/AdminPage/AdminManageMailSchedule/components/MailScheduleModal'
import { MailTemplate , useLazyMailTemplateControllerGetAllMailsQuery, useLazyMailTemplateControllerSearchMailTemplatesQuery, useMailTemplateControllerDeleteMailMutation } from '@app/services/api/mailTemplate/mailTemplate'
import { useAppDispatch, useAppSelector } from '@app/store/hook'
import { setSearchMailTemplateList } from '@app/store/mailTemplate'
import { RepeatInterval } from '@app/enums/subscribe'

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
  const [searchMailTemplate] = useLazyMailTemplateControllerSearchMailTemplatesQuery()
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
      await deleteMail(id).unwrap()
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
      title: 'Repeat Interval',
      dataIndex: 'repeatInterval',
      key: 'repeatInterval',
      render: (text: RepeatInterval) =>
        <span>{text || '-'}</span>
    },
    {
      title: 'Actions',
      key: 'actions',
      width: '10%',
      render: (_: any, record: MailTemplate) =>
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

  return (
    <div>
      <h2 className='font-bold text-lg mb-4'>Manage Mail Schedule Templates</h2>
      <div className='mb-4'>
        <Form 
          form={searchForm} 
          onFinish={handleSearch}           
          initialValues={initialValues}
          layout='inline'
          className='flex flex-wrap gap-2 items-end'
        >
         <Form.Item name='search' className='flex-grow w-full lg:max-w-4xl '>
            <Input
              ref={searchRef}
              placeholder='Search by subject'
              prefix={<SearchOutlined style={{ color: '#bbb' }} />}
              onPressEnter={() => searchForm.submit()}
              style={{ borderRadius: '8px', height: '40px' }}
              className='w-full'
            />
          </Form.Item>
          <Form.Item name='sortField' className='mb-0 w-40'>
            <Select 
              className='w-40 '
              placeholder='Repeat Interval'
            >
              {Object.values(RepeatInterval).map((status) => (
                <Select.Option key={status} value={status}>
                  {status}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item className='mb-0'>
            <Button 
              type='primary' 
              htmlType='submit'
              icon={<SearchOutlined />}
            >
              Search
            </Button>
          </Form.Item>
          <Form.Item className='mb-0 ml-auto'>
            <MtbButton variant='outlined' icon={<PlusOutlined /> } onClick={() => setIsOpenModal(true)}>
              Add New Mail
            </MtbButton>
          </Form.Item>
        </Form>
        
      </div>

       {searchMailsList?.data?.length ? (
        <Table dataSource={searchMailsList.data} columns={columns} rowKey='id' 
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
