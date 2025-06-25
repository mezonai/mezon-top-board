import {
  DeleteOutlined,
  EditOutlined,
  UnlockOutlined,
  SearchOutlined,
} from '@ant-design/icons'
import {
  GetUserDetailsResponse,
  UpdateUserRequest,
  useLazyUserControllerSearchUserQuery,
  useUserControllerActivateUserMutation,
  useUserControllerDeactivateUserMutation,
} from '@app/services/api/user/user'
import { mapDataSourceTable } from '@app/utils/table'
import { Alert, Breakpoint, Button, Form, Input, InputRef, Select, Spin, Table, Tag } from 'antd'
import { useEffect, useMemo, useRef, useState } from 'react'
import { userRoleColors } from './components/UserTableColumns'
import EditUserForm from './EditUserForm'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import { RootState } from '@app/store'

const { Option } = Select
const pageOptions = [5, 10, 15]

interface SearchFormValues {
  search: string;    
  pageSize: 5 | 10 | 15,
  pageNumber: number,
  sortField: string;
  sortOrder: 'ASC' | 'DESC';
}

function UsersList() {
  const [form] = Form.useForm<SearchFormValues>();
  const searchRef = useRef<InputRef>(null);
  const [getUserControllerSearchUser, { error, isLoading }] = useLazyUserControllerSearchUserQuery()
  const [deactivateUser] = useUserControllerDeactivateUserMutation()
  const [activateUser] = useUserControllerActivateUserMutation()
  const users = useSelector((state: RootState) => state.user.adminUserList);
  const [selectedUser, setSelectedUser] = useState<UpdateUserRequest | null>(null)
  const [botPerPage, setBotPerPage] = useState<number>(pageOptions[0])
  const [page, setPage] = useState<number>(1)

  const initialValues: SearchFormValues = {
    search: '',
    pageSize: 5,
    pageNumber: 1,
    sortField: 'createdAt',
    sortOrder: 'DESC'
  };

  const totals = useMemo(() => users?.totalCount || 0, [users])

  useEffect(() => {
    searchUserList();
  }, [page, botPerPage])

  const searchUserList = () => {
    const formValues = form.getFieldsValue();
    getUserControllerSearchUser({
      search: formValues.search || '',
      pageNumber: page,
      pageSize: botPerPage,
      sortField: formValues.sortField,
      sortOrder: formValues.sortOrder
    })
  }

  const errorMessage = useMemo(() => {
    if (error && 'data' in error) {
      const serverError = error.data as { message?: string[] }
      if (serverError?.message) {
        return Array.isArray(serverError.message) ? serverError.message.join(', ') : serverError.message
      }
    }
    return 'There was an issue fetching user data.'
  }, [error])

  const handleSubmit = () => {
    setPage(1);
    searchUserList();
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

  const handleDeactivate = async (userId: string) => {
    try {
      await deactivateUser({ requestWithId: { id: userId } }).unwrap()
      toast.success('User deactivated successfully')
      searchUserList(); // Refresh the list after deactivation
    } catch (error) {
      toast.error('Failed to deactivate user')
    }
  }

  const handleActivate = async (userId: string) => {
    try {
      await activateUser({ requestWithId: { id: userId } }).unwrap()
      toast.success('User activated successfully')
      searchUserList(); // Refresh the list after activation
    } catch (error) {
      toast.error('Failed to activate user')
    }
  }

  const userTableColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
      width: 100,
      responsive: ['xs', 'sm', 'md', 'lg'] as Breakpoint[],
      render: (text: string) => text || <span className='text-gray-400'>No name</span>
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 100
    },
    {
      title: 'Bio',
      dataIndex: 'bio',
      key: 'bio',
      width: 100,
      responsive: ['sm', 'md', 'lg'] as Breakpoint[],
      render: (text: string | null) => (text ? <Tag color='geekblue'>{text}</Tag> : <Tag color='gray'>No bio</Tag>)
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      width: 100,
      render: (role: string) => <Tag color={userRoleColors[role] || 'default'}>{role}</Tag>
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
      fixed: 'right' as const,
      render: (_: any, record: GetUserDetailsResponse) => (
        <div className='flex gap-2'>
          <Button type='primary' icon={<EditOutlined />} onClick={() => setSelectedUser(record)}></Button>
          {
            !record.deletedAt ? (
              <Button type='primary' danger icon={<DeleteOutlined />} onClick={() => handleDeactivate(record.id)}></Button >
            ) : (
              <Button color='green' icon={<UnlockOutlined />} onClick={() => handleActivate(record.id)}></Button >
            )
          }
        </div>
      )
    }
  ]
  
  return (
    <div className='p-4 bg-white rounded-md shadow-md'>
      <h2 className='text-lg font-semibold mb-4'>Users List</h2>

      {/* Search & Sorting Form */}
      <div className='mb-4'>
        <Form 
          form={form}
          onFinish={handleSubmit}
          initialValues={initialValues}
          layout='inline'
          className='flex flex-wrap gap-2 items-end'
        >
          <Form.Item name='search' className='flex-grow w-full lg:max-w-lg '>
            <Input
              ref={searchRef}
              placeholder='Search by name or email'
              prefix={<SearchOutlined style={{ color: '#bbb' }} />}
              onPressEnter={() => form.submit()}
              style={{ borderRadius: '8px', height: '40px' }}
              className='w-full'
            />
          </Form.Item>
          
          <Form.Item name='sortField' className='mb-0 w-30'>
            <Select 
              className='w-30'
              placeholder='Sort Field'
            >
              <Option value='createdAt'>Created At</Option>
              <Option value='name'>Name</Option>
            </Select>
          </Form.Item>

          <Form.Item name='sortOrder' className='mb-0 w-30'>
            <Select 
              className='w-40'
              placeholder='Sort Order'
            >
              <Option value='ASC'>Ascending</Option>
              <Option value='DESC'>Descending</Option>
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
        </Form>
      </div>
      
      {/* Loading Spinner */}
      {isLoading && (
        <div className='flex justify-center my-4'>
          <Spin size='large' />
        </div>
      )}

      {/* Server Error Alert */}
      {error && (
        <Alert message='Error Loading Users' description={errorMessage} type='error' showIcon className='mb-4' />
      )}

      {/* Render Table */}
      {!isLoading && !error && users && users.totalCount !== 0 && (
        <Table
          columns={userTableColumns}
          dataSource={mapDataSourceTable((users?.data || []) as GetUserDetailsResponse[])}
          pagination={{
            current: page,
            pageSize: botPerPage,
            total: totals || 0,
            onChange: handlePageChange,
            showSizeChanger: true,
            pageSizeOptions: pageOptions.map(String)
          }}
          bordered
          scroll={{ x: 'max-content' }}
        />
      )}

      {!isLoading && !error && (!users || users.totalCount === 0) && (
        <div className='text-center p-8 text-gray-500'>
          <p>Không tìm thấy người dùng</p>
        </div>
      )}
      
      {selectedUser && (
        <div className='bg-opacity-50'>
          <EditUserForm user={selectedUser} onClose={() => setSelectedUser(null)} />
        </div>
      )}
    </div>
  )
}

export default UsersList