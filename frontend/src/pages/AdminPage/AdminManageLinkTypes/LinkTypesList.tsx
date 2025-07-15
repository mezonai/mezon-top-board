import { useEffect, useState } from 'react'
import Button from '@app/mtb-ui/Button'
import LinkTypeModal, { LinkTypeFormValues } from './components/LinkTypeModal'
import { Popconfirm, Table } from 'antd'
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

function LinkTypesList() {
  const [createLinkType] = useLinkTypeControllerCreateLinkTypeMutation()
  const [getAllLinkTypes, { isError, error }] = useLazyLinkTypeControllerGetAllLinksQuery()
  const [deleteLinkType] = useLinkTypeControllerDeleteLinkTypeMutation()
  const [updateLinkType] = useLinkTypeControllerUpdateLinkTypeMutation()
  const [uploadImage] = useMediaControllerCreateMediaMutation()

  const linkTypeList = useAppSelector((state: any) => state.link.linkTypeList)

  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingLinkType, setEditingLinkType] = useState<(LinkTypeFormValues & { id?: string }) | null>(null)
  const [isUpdateModal, setIsUpdateModal] = useState(false)

  useEffect(() => {
    getLinkTypeList()
  }, [])

  useEffect(() => {
    if (isError && error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message)
    }
  }, [isError, error])

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

  const getLinkTypeList = async () => {
    try {
      await getAllLinkTypes()
    } catch (error) {
      toast.error('Failed to fetch link types')
    }
  }

  const handleOpen = () => {
    setEditingLinkType(null)
    setIsModalVisible(true)
    setIsUpdateModal(false)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
    setIsUpdateModal(false)
    setEditingLinkType(null)
  }

  const handleModalSubmit = async (values: LinkTypeFormValues & { id?: string }) => {
    const trimmedName = values.name.trim()
    const trimmedPrefix = values.prefixUrl.trim()

    const isDuplicate = linkTypeList?.data?.some((linkType: UpdateLinkTypeRequest) => {
      const sameName = linkType.name === trimmedName
      const samePrefix = linkType.prefixUrl === trimmedPrefix
      if (isUpdateModal && values.id) {
        return (sameName || samePrefix) && linkType.id !== values.id
      }
      return sameName || samePrefix
    })

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
      if (isUpdateModal && values.id) {
        await updateLinkType({
          updateLinkTypeRequest: {
            id: values.id,
            name: trimmedName,
            prefixUrl: trimmedPrefix,
            icon: finalIconUrl
          }
        }).unwrap()

        toast.success('Link type updated')
      } else {
        await createLinkType({
          createLinkTypeRequest: {
            name: trimmedName,
            prefixUrl: trimmedPrefix,
            icon: finalIconUrl
          }
        }).unwrap()

        toast.success('Link type created')
      }

      setIsModalVisible(false)
      setIsUpdateModal(false)
      setEditingLinkType(null)
    } catch (err) {
      toast.error(isUpdateModal ? 'Failed to update link type' : 'Failed to create link type')
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
      render: (text: string) => (
        <img src={getUrlMedia(text)} alt='icon' className='w-[40px] h-[40px]' />
      )
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Prefix',
      dataIndex: 'prefixUrl',
      key: 'prefixUrl',
    },
    {
      title: 'Actions',
      key: 'actions',
      width: '20%',
      render: (_: any, record: any) => (
        <div className='flex gap-2'>
          <Button
            color='blue'
            icon={<EditOutlined />}
            onClick={() => {
              setIsUpdateModal(true)
              setEditingLinkType({
                id: record.id,
                name: record.name,
                prefixUrl: record.prefixUrl,
                icon: record.icon,
              })
              setIsModalVisible(true)
            }}
          />
          <Popconfirm
            title='Delete this link type?'
            onConfirm={() => handleDelete(record.id)}
            okText='Yes'
            cancelText='No'
          >
            <Button icon={<DeleteOutlined />} color='danger'/>
          </Popconfirm>
        </div>
      )
    }
  ]

  return (
    <div>
      <div className='flex justify-end mb-2'>
        <Button
          icon={<PlusOutlined />}
          onClick={handleOpen}
        >
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

      <LinkTypeModal
        open={isModalVisible}
        onClose={handleCancel}
        onSubmit={handleModalSubmit}
        editingData={editingLinkType ?? undefined}
        isUpdate={isUpdateModal}
      />
    </div>
  )
}

export default LinkTypesList
