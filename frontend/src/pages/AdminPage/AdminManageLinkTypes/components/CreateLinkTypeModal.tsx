import { Modal, Form, Input } from 'antd'
import { useEffect, useState } from 'react'
import { EditOutlined } from '@ant-design/icons'
import MtbButton from '@app/mtb-ui/Button'
import { FormProvider, useForm, Controller, useWatch } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import MediaManagerModal from '../../AdminManageMedias/components/MediaManager'
import { LINK_TYPE_SCHEMA } from '@app/validations/linkType.validation'

export interface LinkTypeFormValues {
  name: string
  prefixUrl: string
  icon: string | File
}

interface CreateLinkTypeModalProps {
  open: boolean
  onClose: () => void
  onCreate: (values: LinkTypeFormValues) => void
}

const CreateLinkTypeModal = ({ open, onClose, onCreate }: CreateLinkTypeModalProps) => {
  const methods = useForm<LinkTypeFormValues>({
    resolver: yupResolver(LINK_TYPE_SCHEMA),
    mode: 'all',
    defaultValues: {
      name: '',
      prefixUrl: '',
      icon: ''
    }
  })

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isValid }
  } = methods
  const icon = useWatch({ control, name: 'icon' })

  const [isMediaModalVisible, setIsMediaModalVisible] = useState(false)

  const selectedImage = typeof icon === 'string' ? icon : icon instanceof File ? URL.createObjectURL(icon) : null

  useEffect(() => {
    if (!open) {
      reset()
    }
  }, [open])

  const handleChooseImage = (image: File | string) => {
    if (!image) return
    setValue('icon', image, { shouldValidate: true })
    setIsMediaModalVisible(false)
  }

  const onSubmit = (data: LinkTypeFormValues) => {
    onCreate({
      name: data.name.trim(),
      prefixUrl: data.prefixUrl.trim(),
      icon: data.icon
    })
    reset()
  }

  return (
    <Modal zIndex={2}
      title='Create New Tag'
      open={open}
      onCancel={onClose}
      footer={
        <MtbButton onClick={handleSubmit(onSubmit)} disabled={!isValid}>
          Add
        </MtbButton>
      }
      width={600}
      centered
    >
      <FormProvider {...methods}>
        <Form layout='vertical'>
          <Form.Item label='Name' validateStatus={errors.name ? 'error' : ''} help={errors.name?.message}>
            <Controller
              name='name'
              control={control}
              render={({ field }) => <Input {...field} placeholder='Enter name' />}
            />
          </Form.Item>

          <Form.Item
            label='Prefix URL'
            validateStatus={errors.prefixUrl ? 'error' : ''}
            help={errors.prefixUrl?.message}
          >
            <Controller
              name='prefixUrl'
              control={control}
              render={({ field }) => <Input {...field} placeholder='https://example.com' />}
            />
          </Form.Item>

          <Form.Item label='Icon' validateStatus={errors.icon ? 'error' : ''} help={errors.icon?.message}>
            <div className='flex items-center gap-4'>
              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt='Selected Icon'
                  className='w-[60px] h-[60px] object-cover rounded border'
                />
              ) : (
                <div className='w-[60px] h-[60px] bg-gray-100 border-dashed border rounded' />
              )}
              <MtbButton icon={<EditOutlined />} onClick={() => setIsMediaModalVisible(true)}>
                Choose Image
              </MtbButton>
            </div>
          </Form.Item>
        </Form>
      </FormProvider>

      <MediaManagerModal
        isVisible={isMediaModalVisible}
        onChoose={handleChooseImage}
        onClose={() => setIsMediaModalVisible(false)}
      />
    </Modal>
  )
}

export default CreateLinkTypeModal
