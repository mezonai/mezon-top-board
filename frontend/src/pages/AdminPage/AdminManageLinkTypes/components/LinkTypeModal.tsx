import { Modal, Form, Input } from 'antd'
import { useEffect, useMemo, useState } from 'react'
import { EditOutlined } from '@ant-design/icons'
import MtbButton from '@app/mtb-ui/Button'
import { FormProvider, useForm, Controller, useWatch } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import MediaManagerModal from '../../../../components/MediaManager/MediaManager'
import { LINK_TYPE_SCHEMA } from '@app/validations/linkType.validation'
import { getUrlMedia } from '@app/utils/stringHelper'

export interface LinkTypeFormValues {
  name: string
  prefixUrl: string
  icon: string
}

interface CreateLinkTypeModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (values: LinkTypeFormValues) => void
  editingData?: LinkTypeFormValues & { id?: string }
  isUpdate: boolean
}

const LinkTypeModal = ({ open, onClose, onSubmit, editingData, isUpdate }: CreateLinkTypeModalProps) => {
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
  
  useEffect(() => {
    if (!open) return
    if (isUpdate && editingData) {
      reset({
        name: editingData.name ?? '',
        prefixUrl: editingData.prefixUrl ?? '',
        icon: editingData.icon ?? ''
      })
    } else {
      reset({
        name: '',
        prefixUrl: '',
        icon: ''
      })
    }
  }, [open, isUpdate, editingData, reset])

  const handleChooseImage = (image: string) => {
    if (!image) return
    setValue('icon', image, { shouldValidate: true })
    setIsMediaModalVisible(false)
  }
  const displayedImage = useMemo(() => (icon?.trim() ? getUrlMedia(icon) : ''), [icon])

  const Submit = (data: LinkTypeFormValues) => {
    onSubmit({
      ...(editingData?.id ? { id: editingData.id } : {}),
      name: data.name.trim(),
      prefixUrl: data.prefixUrl.trim(),
      icon: data.icon
    })
    reset()
  }

  return (
    <Modal zIndex={2}
      title={isUpdate ? 'Edit Link Type' : 'Create New Link Type'}
      open={open}
      onCancel={onClose}
      footer={
        <MtbButton onClick={handleSubmit(Submit)} disabled={!isValid}>
          {isUpdate ? 'Save' : 'Add'}
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
              {displayedImage ? (
                <img
                  src={displayedImage }
                  alt='Selected Icon'
                  className='w-[60px] h-[60px] object-cover rounded border border-border'
                />
              ) : (
                <div className='w-[60px] h-[60px] bg-bg-container-secondary border-dashed border border-border rounded' />
              )}
              <MtbButton icon={<EditOutlined />} variant='outlined' onClick={() => setIsMediaModalVisible(true)}>
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

export default LinkTypeModal
