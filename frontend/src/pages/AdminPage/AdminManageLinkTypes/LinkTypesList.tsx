import { useEffect, useState } from 'react'
import Button from '@app/mtb-ui/Button'
import CreateLinkTypeModal, { LinkTypeFormValues } from './components/CreateLinkTypeModal'
import { Input, Popconfirm, Table, Tooltip } from 'antd'
import { toast } from 'react-toastify'
import {
  UpdateLinkTypeRequest,
  useLazyLinkTypeControllerGetAllLinksQuery,
  useLinkTypeControllerCreateLinkTypeMutation,
  useLinkTypeControllerDeleteLinkTypeMutation,
  useLinkTypeControllerUpdateLinkTypeMutation
} from '@app/services/api/linkType/linkType'
import { useAppSelector } from '@app/store/hook'
import MtbTypography from '@app/mtb-ui/Typography/Typography'

import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import { ApiError } from '@app/types/API.types'
import { useMediaControllerCreateMediaMutation } from '@app/services/api/media/media'
import { getUrlMedia } from '@app/utils/stringHelper'
import MediaManagerModal from '../AdminManageMedias/components/MediaManager'

function LinkTypesList() {
  const [createLinkType] = useLinkTypeControllerCreateLinkTypeMutation()
  const [getAllLinkTypes, { isError, error }] = useLazyLinkTypeControllerGetAllLinksQuery()
  const [deleteLinkType] = useLinkTypeControllerDeleteLinkTypeMutation()
  const [updateLinkType] = useLinkTypeControllerUpdateLinkTypeMutation()
  const [uploadImage] = useMediaControllerCreateMediaMutation()

  const linkTypeList = useAppSelector((state: any) => state.link.linkTypeList)

  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false)
  const [isMediaModalVisible, setIsMediaModalVisible] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | File>('')

  const [editingLinkType, setEditingLinkType] = useState<{
    id: string | null
    name: string
    prefixUrl: string
    icon: string
  }>({ id: null, name: '', prefixUrl: '', icon: '' })

  const editError = !editingLinkType.name.trim() || !editingLinkType.prefixUrl.trim()

  useEffect(() => {
    getLinkTypeList()
  }, [])

  useEffect(() => {
    if (isError && error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message)
    }
  }, [isError, error])

  const handleChooseImage = (image: File | string) => {
    if (!image) {
      toast.error('Please select an image')
      return
    }
    setSelectedImage(image)
    setIsMediaModalVisible(false)
  }

  const prepareImageUpload = async (image: File | string): Promise<string> => {
    if (typeof image === 'string') return image

    const formData = new FormData()
    formData.append('file', image)

    try {
      const response = await uploadImage(formData).unwrap()
      return response.data.filePath
    } catch {
      throw new Error('Image upload failed')
    }
  }

  const getDisplayedImage = (record: any) => {
    if (editingLinkType.id === record.id && selectedImage) {
      return typeof selectedImage === 'string' ? selectedImage : URL.createObjectURL(selectedImage)
    }
    return getUrlMedia(record.icon)
  }

  const getLinkTypeList = async () => {
    try {
      await getAllLinkTypes()
    } catch (error) {
      toast.error('Failed to fetch link types')
    }
  }

  const handleCancel = () => {
    setIsCreateModalVisible(false)
  }

  const handleCreate = async (values: LinkTypeFormValues) => {
    const isDuplicate = linkTypeList?.data?.some(
      (linkType: UpdateLinkTypeRequest) =>
        linkType.name === values.name.trim() || linkType.prefixUrl === values.prefixUrl
    )

    if (isDuplicate) {
      toast.error('Link type name or Link type prefix already exists')
      return
    }

    let finalIconUrl = ''

    try {
      finalIconUrl = await prepareImageUpload(values.icon)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Image upload failed')
      return
    }

    try {
      await createLinkType({
        createLinkTypeRequest: {
          ...values,
          icon: finalIconUrl
        }
      }).unwrap()
      setIsCreateModalVisible(false)
      toast.success('Link type created')
    } catch (err) {
      toast.error('Failed to create link type')
    }
  }

  const handleUpdate = async (id: string) => {
    const isDuplicate = linkTypeList?.data?.some(
      (linkType: UpdateLinkTypeRequest) =>
        (linkType.name === editingLinkType.name.trim() || linkType.prefixUrl === editingLinkType.prefixUrl) &&
        linkType.id !== id
    )

    if (isDuplicate) {
      toast.error('Link type name or Link type prefix already exists')
      return
    }
    let updateIcon = ''
    if (selectedImage) {
      try {
        updateIcon = await prepareImageUpload(selectedImage)
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Image upload failed')
        return
      }
    }

    try {
      await updateLinkType({
        updateLinkTypeRequest: {
          id,
          name: editingLinkType.name.trim(),
          prefixUrl: editingLinkType.prefixUrl.trim(),
          icon: updateIcon
        }
      }).unwrap()
      setEditingLinkType({ id: null, name: '', prefixUrl: '', icon: '' })
      setSelectedImage('')
      toast.success('Link type updated')
    } catch {
      toast.error('Failed to update link type')
    }
  }

  const cancelUpdate = () => {
    setEditingLinkType({ id: null, name: '', prefixUrl: '', icon: '' })
    setSelectedImage('')
  }

  const handleDelete = async (id: string) => {
    if (!linkTypeList?.data?.some((linkType: { id: string }) => linkType.id === id)) {
      toast.error('Link type is not exist')
      return
    }
    try {
      await deleteLinkType({ requestWithId: { id } }).unwrap()
      toast.success('Link Type deleted')
    } catch {
      toast.error('Cannot delete link type')
    }
  }

  const columns = [
    {
      title: 'Icon',
      dataIndex: 'icon',
      key: 'icon',
      width: '15%',
      render: (text: string, record: any) =>
        editingLinkType.id === record.id ? (
          <Tooltip
            open={!editingLinkType.icon.trim()}
            title='This field is required'
            placement='topLeft'
            color='rgba(255, 0, 0, 0.8)'
          >
            <img
              src={getDisplayedImage(record)}
              onClick={() => setIsMediaModalVisible(true)}
              style={{ cursor: 'pointer', width: 60, height: 60 }}
            />
          </Tooltip>
        ) : (
          <img src={getUrlMedia(text)} alt='icon' style={{ width: '50px', height: '50px' }} />
        )
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: any) =>
        editingLinkType.id === record.id ? (
          <Tooltip
            open={!editingLinkType.name.trim()}
            title='This field is required'
            placement='topLeft'
            color='rgba(255, 0, 0, 0.8)'
          >
            <Input
              required
              status={!editingLinkType.name.trim() ? 'error' : ''}
              value={editingLinkType.name}
              onChange={(e) => setEditingLinkType((prev) => ({ ...prev, name: e.target.value }))}
            />
          </Tooltip>
        ) : (
          text
        )
    },
    {
      title: 'Prefix',
      dataIndex: 'prefixUrl',
      key: 'prefixUrl',
      render: (text: string, record: any) =>
        editingLinkType.id === record.id ? (
          <Tooltip
            open={!editingLinkType.prefixUrl.trim()}
            title='This field is required'
            placement='topLeft'
            color='rgba(255, 0, 0, 0.8)'
          >
            <Input
              required
              status={!editingLinkType.prefixUrl.trim() ? 'error' : ''}
              value={editingLinkType.prefixUrl}
              onChange={(e) => setEditingLinkType((prev) => ({ ...prev, prefixUrl: e.target.value }))}
            />
          </Tooltip>
        ) : (
          text
        )
    },
    {
      title: 'Actions',
      key: 'actions',
      width: '20%',
      render: (_: any, record: any) =>
        editingLinkType.id === record.id ? (
          <div className='flex gap-2'>
            <Button disabled={editError} color='default' variant='outlined' onClick={() => handleUpdate(record.id)}>
              Save
            </Button>
            <Button onClick={cancelUpdate}>Cancel</Button>
          </div>
        ) : (
          <div className='flex gap-2'>
            <Button
              color='secondary'
              icon={<EditOutlined />}
              onClick={() =>
                setEditingLinkType({ id: record.id, name: record.name, prefixUrl: record.prefixUrl, icon: record.icon })
              }
            />
            <Popconfirm title='Delete this tag?' onConfirm={() => handleDelete(record.id)} okText='Yes' cancelText='No'>
              <Button icon={<DeleteOutlined />} />
            </Popconfirm>
          </div>
        )
    }
  ]

  return (
    <div>
      <div className="flex justify-end mb-2">
        <Button icon={<PlusOutlined />} onClick={() => setIsCreateModalVisible(true)}>
          Add Link Type
        </Button>
      </div>
      {linkTypeList?.data?.length ? (
        <Table dataSource={linkTypeList.data} columns={columns} rowKey='id' pagination={false} />
      ) : (
        <MtbTypography variant='h4' weight='normal' customClassName='!text-center !block !text-gray-500'>
          No result
        </MtbTypography>
      )}

      <CreateLinkTypeModal open={isCreateModalVisible} onClose={handleCancel} onCreate={handleCreate} />
      <MediaManagerModal
        isVisible={isMediaModalVisible}
        onChoose={handleChooseImage}
        onClose={() => setIsMediaModalVisible(false)}
      />
    </div>
  )
}

export default LinkTypesList
