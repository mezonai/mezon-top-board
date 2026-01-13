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
import { Form, Input, InputRef, Popconfirm, Table, Tag, Tooltip } from 'antd'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { SearchOutlined } from '@ant-design/icons'
import { useAppSelector } from '@app/store/hook'
import { toast } from 'react-toastify'
import { SLUG_RULE } from '@app/constants/common.constant'

import TableActionButton from '@app/components/TableActionButton/TableActionButton'
import CreateTagModal, { TagFormValues } from './components/CreateTagModal'

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
  const [tagForm] = Form.useForm<TagFormValues>()

  const { tagList } = useSelector<RootState, ITagStore>((s) => s.tag)
  const searchRef = useRef<InputRef>(null)

  const [editingTag, setEditingTag] = useState<{
    id: string | null
    name: string
    slug: string
  }>({ id: null, name: '', slug: '' })

  const [page, setPage] = useState<number>(1)
  const [botPerPage, setBotPerPage] = useState<number>(pageOptions[0])
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false)

  const editError = !editingTag.name.trim() || !SLUG_RULE.pattern.test(editingTag.slug)

  useEffect(() => {
    searchTagsList()
  }, [page, botPerPage])
  useEffect(() => {
    getTagList()
  }, [])
  
  const totals = useMemo(() => searchTagList?.totalCount || 0, [searchTagList])

  const handleCreate = async (values: TagFormValues) => {
    if (typeof values.slug !== 'string' || !values.slug.trim()) {
      values.slug = generateSlug(values.name)
    }
    values.name = values.name.trim()
    const isDuplicate = tagList?.data?.some((tag: TagResponse) =>
      (tag.name.trim() === values.name || tag.slug === values.slug)
    )
    if (isDuplicate) {
      toast.error('Tag already exists')
      return
    }

    try {
      await createTag({ createTagRequest: values }).unwrap()
      handleCancel()
      await getTagList()
      toast.success('Tag created')
    } catch (err) {
      toast.error('Failed to create tag')
    }
  }

  const handleUpdate = async (id: string) => {
    const isDuplicate = tagList?.data?.some((tag: TagResponse) =>
      (tag.name === editingTag.name.trim() || tag.slug === editingTag.slug) &&
      tag.id !== id
    )

    if (isDuplicate) {
      toast.error('Tag name or tag slug already exists')
      return
    }

    try {
      await updateTag({
        updateTagRequest: {
          id,
          name: editingTag.name.trim(),
          slug: editingTag.slug
        }
      }).unwrap()
      setEditingTag({ id: null, name: '', slug: '' })
      await getTagList()
      toast.success('Tag updated')
    } catch {
      toast.error('Failed to update tag')
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
      toast.success('Tag deleted')
    } catch {
      toast.error('Cannot delete tag. It might be in use.')
    }
  }

  const handleSearch = () => {
    setPage(1)
    searchTagsList(1)
  }

  const searchTagsList = (pageNumber? : number) => {
    const formValues = searchForm.getFieldsValue()
    searchTag({
      search: formValues.search || '',
      pageNumber: pageNumber ?? page,
      pageSize: botPerPage
    })
  }

  const columns = [
    {
      title: 'Tag Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: any) =>
        editingTag.id === record.id ? (
          <Tooltip
            open={!editingTag.name.trim()}
            title='This field is required'
            placement='topLeft' color='rgba(255, 0, 0, 0.8)'
          >
            <Input
              required
              status={!editingTag.name.trim() ? 'error' : ''}
              value={editingTag.name}
              onChange={(e) => setEditingTag((prev) => ({ ...prev, name: e.target.value }))}
            />
          </Tooltip>
        ) : (
          <Tag>{text}</Tag>
        )
    },
    {
      title: 'Tag Slug',
      dataIndex: 'slug',
      key: 'slug',
      render: (text: string, record: any) =>
        editingTag.id === record.id ? (
          <Tooltip
            open={!SLUG_RULE.pattern.test(editingTag.slug)}
            title='Slug must be lowercase, alphanumeric, and use hyphens (no spaces or special characters)'
            placement='topLeft' color='rgba(255, 0, 0, 0.8)'
          >
            <Input
              required
              status={!SLUG_RULE.pattern.test(editingTag.slug) ? 'error' : ''}
              value={editingTag.slug}
              onChange={(e) => setEditingTag((prev) => ({ ...prev, slug: e.target.value }))}
            />
          </Tooltip>
        ) : (
          text
        )
    },
    {
      title: 'Bot Count',
      dataIndex: 'botCount',
      key: 'botCount',
      width: '15%',
    },
    {
      title: 'Actions',
      key: 'actions',
      width: '20%',
      render: (_: any, record: any) =>
        editingTag.id === record.id ? (
          <div className='flex gap-2'>
            <TableActionButton
              actionType="edit"
              disabled={editError}
              onClick={() => handleUpdate(record.id)}
            >
              Save
            </TableActionButton>
            <TableActionButton
              actionType="delete"
              onClick={() => setEditingTag({ id: null, name: '', slug: '' })}
            >
              Cancel
            </TableActionButton>
          </div>
        ) : (
          <div className='flex gap-2'>
            <TableActionButton
              actionType="edit"
              onClick={() => setEditingTag({ id: record.id, name: record.name, slug: record.slug })}
            />
            <Popconfirm title='Delete this tag?' onConfirm={() => handleDelete(record.id)} okText='Yes' cancelText='No'>
              <TableActionButton actionType="delete" />
            </Popconfirm>
          </div>
        )
    }
  ]

  const handleCancel = () => {
    setIsOpenModal(false)
    tagForm.resetFields();
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

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <h2 className='font-bold text-lg'>Manage Tags</h2>
        <TableActionButton
            actionType="add"
            onClick={() => setIsOpenModal(true)}
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

      <CreateTagModal
        open={isOpenModal}
        onClose={handleCancel}
        onCreate={handleCreate}
      />
    </div>
  )
}

export default TagsList
