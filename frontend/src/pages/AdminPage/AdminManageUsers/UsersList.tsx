import {
  SearchOutlined,
} from '@ant-design/icons'
import {
  useLazyUserControllerSearchUserQuery,
  useUserControllerActivateUserMutation,
  useUserControllerDeactivateUserMutation,
} from '@app/services/api/user/user'
import { UpdateUserRequest, GetUserDetailsResponse } from '@app/services/api/user/user.types'
import { mapDataSourceTable } from '@app/utils/table'
import { Alert, Breakpoint, Form, Input, InputRef, Select, Table, Tag } from 'antd'
import { useEffect, useMemo, useRef, useState } from 'react'
import { userRoleColors } from './components/UserTableColumns'
import EditUserForm from './EditUserForm'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import { RootState } from '@app/store'
import TableActionButton from '@app/components/TableActionButton/TableActionButton'

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
      render: (text: string) => text || <span style={{ color: 'var(--text-secondary)' }}>No name</span>
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
          <TableActionButton
            actionType="edit"
            onClick={() => setSelectedUser(record)}
          />
          {
            !record.deletedAt ? (
              <TableActionButton
                actionType="delete"
                onClick={() => handleDeactivate(record.id)}
              />
            ) : (
              <TableActionButton
                actionType="activate"
                onClick={() => handleActivate(record.id)}
              />
            )
          }
        </div>
      )
    }
  ]
  
  return (
    <>    
      <h2 className='font-bold text-lg mb-3'>Manage Users</h2>    
      {/* Search & Sorting Form */}
      <Form 
        form={form}
        onFinish={handleSubmit}
        initialValues={initialValues}
        className='w-full !mt-0 !mb-3'
      >
          <div className='flex flex-col md:flex-row md:items-end gap-3 w-full'>
            <Form.Item name='search' className='w-full md:flex-1 !mb-0'>
              <Input
                ref={searchRef}
                size="large"
                placeholder='Search by name or email'
                prefix={<SearchOutlined className='text-secondary' />}
                onPressEnter={() => form.submit()}
                className='w-full rounded-lg'
              />
            </Form.Item>

            <Form.Item name='sortField' className='w-full md:w-48 !mb-0'>
              <Select 
                size='large'
                placeholder='Sort Field'
              >
                <Option value='createdAt'>Created At</Option>
                <Option value='name'>Name</Option>
              </Select>
            </Form.Item>

            <Form.Item name='sortOrder' className='w-full md:w-36 !mb-0'>
              <Select 
                size="large"
                placeholder='Sort Order'
              >
                <Option value='ASC'>Ascending</Option>
                <Option value='DESC'>Descending</Option>
              </Select>
            </Form.Item>

            <Form.Item className='w-full md:w-auto !mb-0'>
              <TableActionButton
                actionType="search"
                htmlType="submit"
              >
                Search
              </TableActionButton>
            </Form.Item>
          </div>
      </Form>
      {/* Server Error Alert */}
      {error && (
        <Alert title='Error Loading Users' description={errorMessage} type='error' showIcon className='mb-4' />
      )}
      {/* Render Table */}
      <Table
        columns={userTableColumns}
        dataSource={mapDataSourceTable((users?.data || []) as GetUserDetailsResponse[])}
        loading={isLoading}
        pagination={{
          current: page,
          pageSize: botPerPage,
          total: totals || 0,
          onChange: handlePageChange,
          showSizeChanger: true,
          pageSizeOptions: pageOptions.map(String)
        }}
        scroll={{ x: 'max-content' }}
      />
      {selectedUser && (
        <div className='bg-opacity-50'>
          <EditUserForm user={selectedUser} onClose={() => setSelectedUser(null)} />
        </div>
      )}
    </>
  )
}

export default UsersList