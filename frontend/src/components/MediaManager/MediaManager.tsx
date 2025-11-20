import { UploadOutlined } from '@ant-design/icons'

import { useEffect, useState } from 'react'
import { Modal, Spin, Tabs, Upload, Pagination } from 'antd'
import { toast } from 'react-toastify'
import { imageMimeTypes } from '@app/constants/mimeTypes'
import {
  useLazyMediaControllerGetAllMediaQuery,
  useMediaControllerCreateMediaMutation
} from '@app/services/api/media/media'
import { getUrlMedia } from '@app/utils/stringHelper'
import Button from '@app/mtb-ui/Button'
import { useAppSelector } from '@app/store/hook'
import { RootState } from '@app/store'
import CropImageModal from '@app/components/CropImageModal/CropImageModal'

const MediaManagerModal = ({
  isVisible,
  onChoose,
  onClose
}: {
  isVisible: boolean
  onChoose: (path: string) => void
  onClose: () => void
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [activeTab, setActiveTab] = useState('1')
  const [page, setPage] = useState(1);
  const [isCropModalOpen, setIsCropModalOpen] = useState<boolean>(false)

  const [getAllMedia, { isLoading: loadingMedia }] = useLazyMediaControllerGetAllMediaQuery()
  const [uploadImage, { isLoading: isUploading}] = useMediaControllerCreateMediaMutation()
  const mediaList = useAppSelector((state: RootState) => state.media.mediaList)
  const pageSize = 24

  useEffect(() => {
    getMediasList()
  }, [page])

  const getMediasList = () => {
    getAllMedia({
      pageNumber: page,
      pageSize: pageSize,
      sortField: 'createdAt',
      sortOrder: 'ASC'
    })
  }

  const handleUpload = async (options: any) => {
    const { file, onSuccess, onError } = options
    const maxFileSize = 4 * 1024 * 1024
    if (file.size > maxFileSize) {
      toast.error(`${file.name} file upload failed (exceeds 4MB)`)
      return
    }
    if (!imageMimeTypes.includes(file.type)) {
      toast.error('Please upload a valid image file!')
      onError(new Error('Invalid file type'))
      return
    }
    setSelectedFile(file)
    onSuccess('ok')
    setIsCropModalOpen(true)
  }

  const handleUploadFileToServer = async (file: File) => {
    try {
      const formData = new FormData()
      formData.append('file', file)
      const response = await uploadImage(formData).unwrap()
      const serverPath = response.data.filePath
      getMediasList()
      setSelectedImage(getUrlMedia(serverPath))
      return getUrlMedia(serverPath)
    } catch (error) {
      toast.error('Upload failed. Please try again.')
      return ''
    } 
  }

  const handleCropConfirm = (file: File) => {
    setSelectedFile(file)
    setSelectedImage(URL.createObjectURL(file))
    setIsCropModalOpen(false)
  }

  const tabItems = [
    {
      label: 'Upload from device',
      key: '1',
      children: (
        <div className='flex flex-col items-center mt-4'>
          <Upload customRequest={handleUpload} showUploadList={false} accept='image/*'>
            <Button icon={<UploadOutlined />}>
              Click to Upload
            </Button>
          </Upload>
          <i>Choose an image in your browser</i>
          {selectedFile && (
            <img
              src={selectedImage || ''}
              alt=''
              className="w-[100px] h-[100px] object-cover mt-[10px]"
            />
          )}
        </div>
      )
    },
    {
      label: 'Choose from gallery',
      key: '2',
      children: loadingMedia ? (
        <Spin />
      ) : (
        <div className='flex flex-col gap-4'>
          <div className='flex flex-wrap gap-2 max-h-[350px] overflow-y-auto'>
            {mediaList?.data?.map((item: any) => {
              const url = getUrlMedia(item.filePath);
              return (
                <img
                  key={item.id}
                  src={url}
                  alt=''
                  className='w-[6.5rem] h-[6.5rem] object-cover cursor-pointer'
                  style={{
                    border: selectedImage === url ? '2px solid blue' : '1px solid #ccc'
                  }}
                  onClick={() => setSelectedImage(url)}
                />
              );
            })}
          </div>
          <Pagination
            onChange={(p) => setPage(p)}
            pageSize={pageSize}
            current={page}
            total={mediaList?.totalCount || 0}
            showSizeChanger={false}
            className="self-center"
          />
        </div>
      )
    }
  ]

  const handleChoose = async () => {
    if (selectedFile) {
      const uploadedUrl = await handleUploadFileToServer(selectedFile)
      if (uploadedUrl) {
        onChoose(uploadedUrl)
        handleCancel()
      }
      return
    }
    if (selectedImage) {
      onChoose(selectedImage)
      handleCancel()
    } else {
      toast.error('Please select an image first')
    }
  }

  const handleCancel = () => {
    setActiveTab('1')
    setPage(1)
    setSelectedFile(null)
    setSelectedImage(null)
    onClose()
  }

  const handleCloseModal = () => {
    if (!isUploading) {
      setIsCropModalOpen(false)
      setSelectedFile(null)
    }
  }

  const handleTabChange = (key: string) => {
    setActiveTab(key)
    setSelectedImage(null)
    setSelectedFile(null)
  }

  return (
    <>
      <Modal zIndex={3}
        width={'59rem'}
        centered
        title='Choose Icon'
        open={isVisible}
        onCancel={handleCancel}
        onOk={handleChoose}
        footer={
          <div className="flex justify-between items-center">
            {activeTab === '2' && (
              <div className="text-sm text-gray-500 pl-2">
                Total {mediaList?.totalCount || 0} image(s)
              </div>
            )}

            <div className="ml-auto flex gap-2">
              <Button onClick={handleCancel} color="default">
                Cancel
              </Button>
              <Button onClick={handleChoose}>OK</Button>
            </div>
          </div>
        }
      >
        <Tabs
          activeKey={activeTab}
          onChange={handleTabChange}
          type='card'
          items={tabItems}
        />
      </Modal>
      <CropImageModal
        open={isCropModalOpen}
        imgSrc={selectedFile ? URL.createObjectURL(selectedFile) : ''}
        originalFileName={selectedFile?.name}
        aspect={1}
        onCancel={handleCloseModal}
        onConfirm={handleCropConfirm}
        parentLoading={isUploading}
      />
    </>
  )
}

export default MediaManagerModal