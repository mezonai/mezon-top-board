import { Role } from '@app/enums/role.enum'
import { UpdateUserRequest } from '@app/services/api/user/user.types'
import { useUserControllerUpdateUserMutation } from '@app/services/api/user/user'
import { handleMapOption } from '@app/utils/stringHelper'
import { Button, Form, Input, Modal, Select } from 'antd'
import { toast } from 'react-toastify'

const EditUserForm = ({ user, onClose }: { user: UpdateUserRequest; onClose: () => void }) => {
  const [form] = Form.useForm()
  const [updateUser, { isLoading, error }] = useUserControllerUpdateUserMutation()

  // Handle form submission
  const handleSubmit = async (values: UpdateUserRequest) => {
    try {
      await updateUser({ updateUserRequest: { ...values, id: user.id } }).unwrap()
      toast.success('User updated successfully!')
      onClose()
    } catch (err) {
      toast.error('error.message')
    }
  }

  return (
    <Modal
      open
      title='Edit User'
      onCancel={onClose}
      footer={[
        <Button key='cancel' onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>,
        <Button key='submit' type='primary' onClick={() => form.submit()} loading={isLoading}>
          {isLoading ? 'Updating...' : 'Update User'}
        </Button>
      ]}
    >
      <Form
        form={form}
        layout='horizontal'
        initialValues={user}
        onFinish={handleSubmit}
        labelCol={{ span: 3 }}
        wrapperCol={{ span: 20 }}
      >
        {/* Name Field */}
        <Form.Item label='Name' name='name'>
          <Input placeholder='Enter name' />
        </Form.Item>

        {/* Bio Field */}
        <Form.Item label='Bio' name='bio'>
          <Input placeholder='Enter bio' />
        </Form.Item>

        {/* Role Selection */}
        <Form.Item label='Role' name='role'>
          <Select placeholder='Select role' options={handleMapOption(Role)} />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default EditUserForm
