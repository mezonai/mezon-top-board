import { Form, Input, Popconfirm, Table} from 'antd'
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import MtbTypography from '@app/mtb-ui/Typography/Typography'

import MtbButton from '@app/mtb-ui/Button'
import { useMemo, useState } from 'react'
import CreateMailModal from '@app/pages/AdminPage/AdminManageMailSchedule/components/CreateMailScheduleModal'
import { Mail, useMailControllerDeleteMailMutation, useMailControllerGetAllMailsQuery } from '@app/services/api/mail/mail'
import { toast } from 'react-toastify'
import EditMailModal from '@app/pages/AdminPage/AdminManageMailSchedule/components/EditMailScheduleModal'

const pageOptions = [5, 10, 15]

function MailSchedule() {

  const [isOpenModal, setIsOpenModal] = useState<boolean>(false)
  const [isOpenEditModal, setIsOpenEditModal] = useState<boolean>(false)
  const [page, setPage] = useState<number>(1)
  const [botPerPage, setBotPerPage] = useState<number>(pageOptions[0])
  const [currentMail, setCurrentMail] = useState<Mail>()
  
  const { data: mailData } = useMailControllerGetAllMailsQuery()
  const { refetch } = useMailControllerGetAllMailsQuery()
  const [deleteMail] = useMailControllerDeleteMailMutation()
  const totals = useMemo(() => mailData?.totalCount || 0, [mailData])

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
        await deleteMail(id).unwrap()
        await refetch()
        toast.success('Mail deleted')
      } catch {
        toast.error('Cannot delete mail. It might be in use.')
      }
  }

  const handleOpenEditModal = (mail: Mail) => {
    setCurrentMail(mail)
    setIsOpenEditModal(true)
  }

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (text: string) =>
        <span>{text}</span>
    },
    {
      title: 'Subject',
      dataIndex: 'subject',
      key: 'subject',
      render: (text: string) =>
        <span>{text}</span>
    },
    {
      title: 'Actions',
      key: 'actions',
      width: '10%',
      render: (_: any, record: Mail) =>
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
      <h2 className='font-bold text-lg mb-4'>Manage Mails</h2>
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
          Add New Mail
        </MtbButton>
      </div>

       {mailData?.data?.length ? (
        <Table dataSource={mailData.data} columns={columns} rowKey='id' 
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
      
      <CreateMailModal
        open={isOpenModal}
        onClose={handleCancel}
      />

      <EditMailModal
        selectMail={currentMail}
        open={isOpenEditModal}
        onClose={handleCancel}
      />
    </div>
  )
}

export default MailSchedule
