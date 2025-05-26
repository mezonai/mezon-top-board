import { useEffect, useState } from 'react'
import Button from '@app/mtb-ui/Button'
import CreateLinkTypeModal, { LinkTypeFormValues } from './components/CreateLinkTypeModal'
import { Form, Input, Popconfirm, Table, Tooltip } from 'antd'
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

import { SearchOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import { ApiError } from '@app/types/API.types'
import { useMediaControllerCreateMediaMutation } from '@app/services/api/media/media'
import { getUrlMedia } from '@app/utils/stringHelper'

function LinkTypesList() {
  const [createLinkType] = useLinkTypeControllerCreateLinkTypeMutation()
  const [getAllLinkTypes, { isError, error }] = useLazyLinkTypeControllerGetAllLinksQuery()
  const [deleteLinkType] = useLinkTypeControllerDeleteLinkTypeMutation()
  const [updateLinkType] = useLinkTypeControllerUpdateLinkTypeMutation()
  const [uploadImage, { isLoading: uploading }] = useMediaControllerCreateMediaMutation()

  const linkTypeList = useAppSelector((state: any) => state.link.linkTypeList)

  const [isModalVisible, setIsModalVisible] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const [createForm] = Form.useForm<LinkTypeFormValues>()
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

  const getLinkTypeList = async () => {
    try {
      await getAllLinkTypes()
    } catch (error) {
      toast.error('Failed to fetch link types')
    }
  }

  const handleCancel = () => {
    setIsModalVisible(false)
    createForm.resetFields()
  }

  const handleCreate = async (values: LinkTypeFormValues) => {
    const isDuplicate = linkTypeList?.data?.some((linkType: UpdateLinkTypeRequest) =>
      linkType.name === values.name.trim() || linkType.prefixUrl === values.prefixUrl
    );

    if (isDuplicate) {
      toast.error('Link type name or Link type prefix already exists');
      return;
    }

    let finalIconUrl = '';

    if (values.icon instanceof File) {
      const formData = new FormData();
      formData.append('file', values.icon);
      try {
        const response = await uploadImage(formData).unwrap();
        finalIconUrl = getUrlMedia(response.data.filePath);
      } catch (error) {
        toast.error('Image upload failed');
        return;
      }
    } else if (typeof values.icon === 'string') {
      finalIconUrl = values.icon;
    }

    if (!finalIconUrl) {
      toast.error('Please upload or select a valid image');
      return;
    }

    try {
      await createLinkType({
        createLinkTypeRequest: {
          ...values,
          icon: finalIconUrl
        }
      }).unwrap();
      setIsModalVisible(false);
      await getLinkTypeList();
      toast.success('Link type created');
    } catch (err) {
      toast.error('Failed to create link type');
    }
  };

  const handleUpdate = async (id: string) => {
    const isDuplicate = linkTypeList?.data?.some((linkType: UpdateLinkTypeRequest) =>
      (linkType.name === editingLinkType.name.trim() || linkType.prefixUrl === editingLinkType.prefixUrl) &&
      linkType.id !== id
    )

    if (isDuplicate) {
      toast.error('Link type name or Link type prefix already exists')
      return
    }

    try {
      await updateLinkType({
        updateLinkTypeRequest: {
          id,
          name: editingLinkType.name.trim(),
          prefixUrl: editingLinkType.prefixUrl.trim(),
          icon: editingLinkType.icon.trim()
        }
      }).unwrap()
      setEditingLinkType({ id: null, name: '', prefixUrl: '', icon: '' })
      toast.success('Link type updated')
    } catch {
      toast.error('Failed to update link type')
    }
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
            <Input
              required
              status={!editingLinkType.icon.trim() ? 'error' : ''}
              value={editingLinkType.icon}
              onChange={(e) => setEditingLinkType((prev) => ({ ...prev, icon: e.target.value }))}
            />
          </Tooltip>
        ) : (
          <img src={text} alt='icon' style={{ width: '50px', height: '50px' }} />
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
              // status={!SLUG_RULE.pattern.test(editingLinkType.slug) ? 'error' : ''}
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
            <Button onClick={() => setEditingLinkType({ id: null, name: '', prefixUrl: '', icon: '' })}>Cancel</Button>
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
      {linkTypeList?.data?.length ? (
        <Table dataSource={linkTypeList.data} columns={columns} rowKey='id' pagination={false} />
      ) : (
        <MtbTypography variant='h4' weight='normal' customClassName='!text-center !block !text-gray-500'>
          No result
        </MtbTypography>
      )}
      <Button onClick={() => setIsModalVisible(true)}>Add Prefix</Button>

      {selectedImage && <img src={selectedImage} alt='Selected' style={{ maxWidth: '200px' }} />}

      <CreateLinkTypeModal open={isModalVisible} onClose={handleCancel} onCreate={handleCreate} />
    </div>
  )
}

export default LinkTypesList
