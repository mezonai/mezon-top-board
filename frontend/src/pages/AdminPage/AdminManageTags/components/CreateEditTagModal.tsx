import { Form, Input, Modal } from 'antd'
import { EditOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'
import { generateSlug } from '@app/utils/stringHelper'
import MtbButton from '@app/mtb-ui/Button'
import { SLUG_RULE } from '@app/constants/common.constant'
import { TAG_COLORS } from '@app/constants/colors'
import { ColorSelector } from '../../../../mtb-ui/ColorSelector/ColorSelector'
import { TagResponse } from '@app/services/api/tag/tag.types'

export interface TagFormValues {
  name: string
  slug: string
  color?: string
}

interface CreateEditTagModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (values: TagFormValues) => void
  editingData?: TagResponse | null
}

const CreateEditTagModal = ({ open, onClose, onSubmit, editingData }: CreateEditTagModalProps) => {
  const [form] = Form.useForm<TagFormValues>()
  const [showSlugInput, setShowSlugInput] = useState(false)
  const [isSlugEdited, setIsSlugEdited] = useState(false)

  const isEditMode = !!editingData;

  useEffect(() => {
    if (open) {
      if (editingData) {
        form.setFieldsValue({
          name: editingData.name,
          slug: editingData.slug,
          color: editingData.color || TAG_COLORS.DEFAULT
        });
        setShowSlugInput(true); 
      } else {
        form.resetFields();
        setShowSlugInput(false);
        setIsSlugEdited(false);
      }
    }
  }, [open, editingData, form])

  const handleSubmit = () => {
    form.validateFields().then((values) => {
       if (!values.slug?.trim()) {
          values.slug = generateSlug(values.name);
       }
       
       onSubmit({
         name: values.name.trim(),
         slug: values.slug.trim(),
         color: values.color
       });
    });
  }

  return (
    <Modal
      title={isEditMode ? "Edit Tag" : "Create New Tag"}
      open={open}
      onCancel={onClose}
      footer={<MtbButton onClick={handleSubmit}>{isEditMode ? "Save" : "Add"}</MtbButton>}
      width={600}
      centered
    >
      <Form
        form={form}
        layout="vertical"
        className="pt-2"
      >
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: 'This field is required' }]}
        >
          <Input
            placeholder="Tag name"
            onChange={(e) => {
              if (!isEditMode && !isSlugEdited) {
                const name = e.target.value
                const slug = generateSlug(name)
                form.setFieldsValue({ slug })
              }
            }}
          />
        </Form.Item>

        <Form.Item
          name="color"
          label="Color"
          initialValue={TAG_COLORS.DEFAULT}
        >
          <ColorSelector />
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
              placeholder="Tag slug"
              onChange={() => setIsSlugEdited(true)}
            />
          </Form.Item>
        )}
      </Form>
    </Modal>
  )
}

export default CreateEditTagModal