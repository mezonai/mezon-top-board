import React, { useState } from 'react'
import { Button, Input, Modal } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import CampaignTable from './CampaignTable'
import {
  NewsletterCampaign,
  useNewsletterCampaignControllerDeleteMutation,
  useNewsletterCampaignControllerSearchQuery
} from '@app/services/api/newsletterCampaign/newsletterCampaign'
import { toast } from 'react-toastify'
import EditSletter from './CreateNewSletter'
import NewsletterSchedule from './NewsletterSchedule'

const NewsletterCampaigns: React.FC = () => {
  const [page, setPage] = useState(1)
  const [pageSize] = useState(10)
  const [searchText, setSearchText] = useState('')
  const [tempSearch, setTempSearch] = useState('')
  const [openEdit, setOpenEdit] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [editingRecord, setEditingRecord] = useState<any>(null)
  const [viewingRecord, setViewingRecord] = useState<any>(null)
  // RTK Query search hook
  const { data, isLoading, isError, error, refetch } = useNewsletterCampaignControllerSearchQuery({
    pageNumber: page,
    pageSize,
    search: searchText || undefined // RTK Query expects undefined for optional params
  })

  // RTK Query delete hook
  const [deleteCampaign] = useNewsletterCampaignControllerDeleteMutation()

  // Extract campaigns and total count from response
  const campaigns: NewsletterCampaign[] =
    data?.data?.map((item) => ({
      ...item
    })) || []
  const total = data?.totalCount || 0

  // Handle errors
  if (isError) {
    toast.error(`Failed to load campaigns: ${error || 'Unknown error'}`)
  }

  // Handle delete
  const handleDelete = async (record: NewsletterCampaign) => {
    try {
      await deleteCampaign({ id: record.id }).unwrap()
      toast.success('Campaign deleted')
      refetch()
    } catch {
      toast.error('Failed to delete campaign')
    }
  }
  const handleCreate = () => {
    setIsEdit(false)
    setOpenEdit(true)
  }
  const handleSearch = () => {
    setSearchText(tempSearch)
    refetch()
  }

  return (
    <>
      <div className='mb-4'>
        <Button
          type='primary'
          onClick={handleCreate}
          style={{ fontSize: 16, height: 40}}
        >
          Create App
        </Button>
      </div>
      <EditSletter
        isEdit={isEdit}
        open={openEdit}
        record={editingRecord}
        onClose={() => {
          setOpenEdit(false)
          setEditingRecord(null)
        }}
        refetch={refetch}
      />
      <NewsletterSchedule />
      <div className='flex gap-4 mb-3'>
        <Input
          placeholder='Search campaigns...'
          prefix={<SearchOutlined />}
          value={tempSearch}
          onChange={(e) => setTempSearch(e.target.value)}
          className='w-full rounded-[8px] h-[40px]'
          style={{ marginBottom: 16, width: '100%' }}
        />
        <Button type='primary' className='w-50' size='large' icon={<SearchOutlined />} onClick={handleSearch}>
          Search
        </Button>
      </div>

      <CampaignTable
        data={campaigns}
        loading={isLoading}
        total={total}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onView={(record) => setViewingRecord(record)}
        onEdit={(record) => {
          setIsEdit(true)
          setEditingRecord(record)
          setOpenEdit(true)
        }}
        onDelete={handleDelete}
      />
      <Modal
        open={!!viewingRecord}
        title={viewingRecord?.title}
        style={{ minWidth: 600 }}
        bodyStyle={{ minHeight: 300 }}
        footer={null}
        onCancel={() => setViewingRecord(null)}
      >
        <div>
          <div>
            <b>{viewingRecord?.headline}</b>
          </div>
          <div dangerouslySetInnerHTML={{ __html: viewingRecord?.description || '' }} />
        </div>
      </Modal>
    </>
  )
}

export default NewsletterCampaigns
