import { Form, Input, Modal } from 'antd'
import { EditOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'
import { generateSlug } from '@app/utils/stringHelper'
import MtbButton from '@app/mtb-ui/Button'
import { SLUG_RULE } from '@app/constants/common.constant'

export interface TagFormValues {
  name: string
  slug: string
}

interface CreateTagModalProps {
  open: boolean
  onClose: () => void
  onCreate: (values: TagFormValues) => void
}

const CreateTagModal = ({ open, onClose, onCreate }: CreateTagModalProps) => {
  const [form] = Form.useForm<TagFormValues>()
  const [showSlugInput, setShowSlugInput] = useState(false)
  const [isSlugEdited, setIsSlugEdited] = useState(false)

  useEffect(() => {
    if (!open) {
      form.resetFields()
      setShowSlugInput(false)
      setIsSlugEdited(false)
    }
  }, [open])

  return (
    <Modal
      title="Create New Tag"
      open={open}
      onCancel={onClose}
      footer={<MtbButton onClick={() => form.submit()}>Add</MtbButton>}
      width={600}
      centered
    >
      <Form
        form={form}
        layout="vertical"
        className="!pt-2"
        onFinish={(values) => {
          if (!values.slug?.trim()) {
            values.slug = generateSlug(values.name)
          }
          onCreate({
            name: values.name.trim(),
            slug: values.slug.trim()
          })
        }}
      >
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: 'This field is required' }]}
        >
          <Input
            placeholder="New tag name"
            onChange={(e) => {
              const name = e.target.value
              const slug = isSlugEdited
                ? form.getFieldValue('slug')
                : generateSlug(name)

              form.setFieldsValue({ name, slug })
            }}
          />
        </Form.Item>

        {!showSlugInput ? (
          <div className="flex items-center justify-between mb-3">
            <Form.Item shouldUpdate>
              {() => (
                <div>
                  <strong>Slug:</strong> {form.getFieldValue('slug')}
                </div>
              )}
            </Form.Item>
            <MtbButton color='default' variant='outlined'
              icon={<EditOutlined />}
              onClick={() => {
                setShowSlugInput(true)
                setIsSlugEdited(true)
              }}
            />
          </div>
        ) : (
          <Form.Item
            name="slug"
            label="Slug"
            rules={[
              { required: true, message: 'This field is required' },
              SLUG_RULE
            ]}
          >
            <Input
              placeholder="New tag slug"
              onChange={() => setIsSlugEdited(true)}
            />
          </Form.Item>
        )}
      </Form>
    </Modal>
  )
}

export default CreateTagModal
