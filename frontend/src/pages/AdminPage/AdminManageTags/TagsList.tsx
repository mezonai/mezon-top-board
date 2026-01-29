import {
  useLazyTagControllerGetTagsQuery,
  useLazyTagControllerSearchTagsQuery,
  useTagControllerCreateTagMutation,
  useTagControllerDeleteTagMutation,
  useTagControllerUpdateTagMutation
} from '@app/services/api/tag/tag'
import { TagResponse } from '@app/services/api/tag/tag.types'
import { RootState } from '@app/store'
import { ITagStore } from '@app/store/tag'
import { generateSlug } from '@app/utils/stringHelper'
import { Form, Input, InputRef, Modal, Table, Tag } from 'antd'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { SearchOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import { useAppSelector } from '@app/store/hook'
import { toast } from 'react-toastify'

import TableActionButton from '@app/components/TableActionButton/TableActionButton'
import CreateEditTagModal, { TagFormValues } from './components/CreateEditTagModal'
import { ColorSelector } from '@app/mtb-ui/ColorSelector/ColorSelector'

interface SearchFormValues {
  search: string
}
const pageOptions = [5, 10, 15]

function TagsList() {
  const [getTagList] = useLazyTagControllerGetTagsQuery()
  const [createTag] = useTagControllerCreateTagMutation()
  const [updateTag] = useTagControllerUpdateTagMutation()
  const [deleteTag] = useTagControllerDeleteTagMutation()
  const [searchTag, { isLoading }] = useLazyTagControllerSearchTagsQuery()
  const searchTagList = useAppSelector((state: RootState) => state.tag.searchTagList)

  const [searchForm] = Form.useForm<SearchFormValues>()
  const { confirm } = Modal

  const { tagList } = useSelector<RootState, ITagStore>((s) => s.tag)
  const searchRef = useRef<InputRef>(null)

  const [selectedTag, setSelectedTag] = useState<TagResponse | null>(null)
  const [page, setPage] = useState<number>(1)
  const [botPerPage, setBotPerPage] = useState<number>(pageOptions[0])
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false)

  useEffect(() => {
    searchTagsList()
  }, [page, botPerPage])
  useEffect(() => {
    getTagList()
  }, [])

  const totals = useMemo(() => searchTagList?.totalCount || 0, [searchTagList])

  const handleModalSubmit = async (values: TagFormValues) => {
    if (typeof values.slug !== 'string' || !values.slug.trim()) {
      values.slug = generateSlug(values.name)
    }
    values.name = values.name.trim()

    const isDuplicate = tagList?.data?.some((tag: TagResponse) => {
      const isSameNameOrSlug = tag.name.trim() === values.name || tag.slug === values.slug;
      if (selectedTag) {
        return isSameNameOrSlug && tag.id !== selectedTag.id;
      }
      return isSameNameOrSlug;
    });

    if (isDuplicate) {
      toast.error('Tag already exists')
      return
    }

    try {
      if (selectedTag) {
        await updateTag({
          updateTagRequest: {
            id: selectedTag.id,
            name: values.name,
            slug: values.slug,
            color: values.color
          }
        }).unwrap()
        toast.success('Tag updated')
      } else {
        await createTag({
          createTagRequest: {
            name: values.name,
            slug: values.slug,
            ...(values.color && { color: values.color })
          }
        }).unwrap()
        toast.success('Tag created')
      }

      handleCancel()
      await getTagList()
      searchTagsList()
    } catch (err) {
      toast.error(selectedTag ? 'Failed to update tag' : 'Failed to create tag')
    }
  }

  const handleDelete = async (id: string) => {
    if (tagList?.data?.some((tag: TagResponse) => tag.id === id && tag.botCount > 0) ) {
      toast.error('Tag is in use and cannot be deleted')
      return
    }
    try {
      await deleteTag({ requestWithId: { id } }).unwrap()
      await getTagList()
      searchTagsList()
      toast.success('Tag deleted')
    } catch {
      toast.error('Cannot delete tag. It might be in use.')
    }
  }

  const handleConfirmDelete = (id: string) => {
    confirm({
      title: 'Delete this tag?',
      icon: <ExclamationCircleOutlined />,
      content: 'Are you sure you want to delete this tag? This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      centered: true,
      onOk: () => handleDelete(id),
    })
  }

  const handleSearch = () => {
    setPage(1)
    searchTagsList(1)
  }

  const searchTagsList = (pageNumber?: number) => {
    const formValues = searchForm.getFieldsValue()
    searchTag({
      search: formValues.search || '',
      pageNumber: pageNumber ?? page,
      pageSize: botPerPage
    })
  }

  const handleOpenCreate = () => {
    setSelectedTag(null);
    setIsOpenModal(true);
  }

  const handleOpenEdit = (record: TagResponse) => {
    setSelectedTag(record);
    setIsOpenModal(true);
  }

  const handleCancel = () => {
    setIsOpenModal(false)
    setSelectedTag(null)
  }

  const columns = [
    {
      title: 'Tag Name',
      dataIndex: 'name',
      key: 'name',
      width: '25%',
      render: (_: any, record: TagResponse) => (
        <div className="h-[32px] flex items-center">
          <Tag color={record.color}>{record.name}</Tag>
        </div>
      )
    },
    {
      title: 'Tag Slug',
      dataIndex: 'slug',
      key: 'slug',
      width: '25%',
      render: (text: string) => (
        <div className="h-[32px] flex items-center">
          {text}
        </div>
      )
    },
    {
      title: 'Color',
      dataIndex: 'color',
      key: 'color',
      width: '20%',
      render: (color: string) => (
        <div className="h-[32px] flex items-center">
          <ColorSelector
            value={color}
            disabled={true}
          />
        </div>
      )
    },
    {
      title: 'Bot Count',
      dataIndex: 'botCount',
      key: 'botCount',
      width: '15%',
      render: (count: number) => (
        <div className="h-[32px] flex items-center">
          {count}
        </div>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <div className='h-[32px]'>
            <TableActionButton
              actionType="edit"
              onClick={() => handleOpenEdit(record)}
            />
            <TableActionButton 
              actionType="delete" 
              onClick={() => handleConfirmDelete(record.id)}
            />
        </div>
      )
    }
  ]

  const handlePageChange = (newPage: number, newPageSize?: number) => {
    setPage(newPage);
    if (newPage > Math.ceil(totals / botPerPage)) {
      setPage(1)
    }
    if (newPageSize) {
      setBotPerPage(newPageSize);
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <h2 className='font-bold text-lg'>Manage Tags</h2>
        <TableActionButton
          actionType="add"
          onClick={handleOpenCreate}
        >
          Add
        </TableActionButton>
      </div>
      <div className='flex gap-4 mb-3'>
        <Form form={searchForm} onFinish={handleSearch} initialValues={{ search: '' }} className='flex-grow'>
          <Form.Item name='search' className='w-full !mb-0'>
            <Input
              ref={searchRef}
              size="large"
              placeholder='Search by name or slug'
              prefix={<SearchOutlined className='text-secondary' />}
              onPressEnter={() => searchForm.submit()}
              className='rounded-lg'
            />
          </Form.Item>
        </Form>
        <TableActionButton
          actionType="search"
          onClick={() => searchForm.submit()}
        >
          Search
        </TableActionButton>
      </div>

      <Table
        dataSource={searchTagList?.data || []}
        columns={columns}
        rowKey='id'
        loading={isLoading}
        pagination={{
          current: page,
          pageSize: botPerPage,
          total: totals,
          onChange: handlePageChange,
          showSizeChanger: true,
          pageSizeOptions: pageOptions.map(String)
        }}
      />

      <CreateEditTagModal
        open={isOpenModal}
        onClose={handleCancel}
        onSubmit={handleModalSubmit}
        editingData={selectedTag}
      />
    </div>
  )
}

export default TagsList